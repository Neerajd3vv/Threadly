import { PrismaClient } from "@prisma/client"
import { bucket } from "../utils/gcpStorage";
import path from "path"
import { Request, Response } from "express"
import { validationParser } from "../utils/validationParser"
import { resumeSchema } from "../validations/resumeSchema"
import { redis } from "../lib/redisClient"
import { randomUUID } from "crypto"


const prisma = new PrismaClient()

export async function resumeUpload(req: Request, res: Response) {
    try {
        const fileName = req.body.fileName as string;
        const fileType = req.body.fileType as string;

        if (!fileName || !fileType) {
            return res.status(400).json({ success: false, error: "Missing fileName or fileType" });
        }

        const baseName = path.parse(fileName || "").name
        const ext = fileType?.split("/")[1];
        const randomString = Math.random().toString(36).substring(2, 8)
        const finalFileName = `${Date.now().toString(36)}_${randomString}_${baseName}.${ext}`;

        const file = bucket.file(finalFileName)
        const [url] = await file.getSignedUrl({
            action: "write",
            expires: Date.now() + 1 * 60 * 1000,
            contentType: fileType as string
        })

        return res.status(200).json({
            success: true,
            signedUrl: url,
            fileName: finalFileName
        });

    } catch (error) {
        console.error("[GET /api/uploads/resumeUpload] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }

}


export async function jdWithFileName(req: Request, res: Response) {


    try {

        if (!req.user?.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const parsed = validationParser(resumeSchema, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ success: false, error: "ValidationFailed", details: parsed.errors })
        }


        const userId = req.user.id

        // used transaction here
        await prisma.$transaction(async (tx) => {
            const jd = await tx.jd.create({
                data: {
                    description: parsed.data.jd,
                    userId
                }
            })
            const resume = await tx.resume.create({
                data: {
                    fileName: parsed.data.fileName,
                    userId
                }
            })

            return { jd, resume }
        })

        return res.status(201).json({
            success: true,
            message: "JD and Resume saved successfully",
        });




    } catch (error) {
        console.error("[POST /api/upload/jd-resume] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}


export async function jdWithFileNameGuest(req: Request, res: Response) {


    try {
        const { jd, fileName } = req.body

        const guestSessionId = randomUUID()

        await redis.hSet(`guest:${guestSessionId}`, { jd, fileName })

        await redis.expire(`guest:${guestSessionId}`, 60 * 60 * 24);



        return res.json({
            success: true,
            guestSessionId,
            message: "Resume + JD stored successfully for guest",

        });



    } catch (error) {
        console.error("[POST /api/upload/jd-resume/guest] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}



