import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { validationParser } from "../utils/validationParser"
import { Request, Response } from "express"
import { resumeSchema } from "../validations/resumeSchema"

export const jdWithFileName = async (req: Request, res: Response) => {



    try {

        if (!req.user?.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const parsed = validationParser(resumeSchema, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ success: false, error: "ValidationFailed", details: parsed.errors })
        }


        const userId = Number(req.user.id);

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
        console.error("[POST /api/jd] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}



