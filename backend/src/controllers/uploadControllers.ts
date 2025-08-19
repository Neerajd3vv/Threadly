import { bucket } from "../utils/gcpStorage";
import path from "path"
import { Request, Response } from "express"

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
            expires: Date.now() + 1 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            signerUrl: url,
            fileName: finalFileName
        });

    } catch (error) {
        console.error("[GET /api/uploads/resumeUpload] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }

}