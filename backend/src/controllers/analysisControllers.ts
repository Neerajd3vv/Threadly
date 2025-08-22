import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { redis } from "../lib/redisClient"
import { Request, Response } from "express"
import { runAnalysis } from "../services/runAnalysis";
import { resumeSchema } from "../validations/resumeSchema";
import { validationParser } from "../utils/validationParser";
import { useAnalysis } from "../validations/userAnalysis";
import { analysisQueue } from "../queues/analysisQueue";



export async function guestAnalysis(req: Request, res: Response) {

    try {
        const { guestSessionId } = req.body;

        if (!guestSessionId) {
            return res.status(400).json({ success: false, error: "Missing guestSessionId" });
        }

        console.log("guestSesssionId", guestSessionId);

        const data = await redis.hGetAll(`guest:${guestSessionId}`);
        console.log("backend-redis-data-guest", data);

        if (!data || !data.jd || !data.fileName) {
            return res.status(404).json({ success: false, error: "Session expired or invalid" });
        }


        const analysis = await runAnalysis(data.jd, data.fileName)

        if (analysis.error) {
            if (
                analysis.error.includes("Resume too short") ||
                analysis.error.includes("Invalid file")
            ) {
                return res.status(400).json({ success: false, error: analysis.error });
            }

            if (analysis.error.includes("produce result")) {
                return res.status(422).json({ success: false, error: analysis.error });
            }

            return res.status(500).json({
                success: false,
                error: analysis.error || "Unknown analysis error",
            });
        }


        return res.status(200).json({ success: true, analysis });


    } catch (error) {
        console.error("[POST /api/analysis/guest] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }

}


export async function analysis(req: Request, res: Response) {
    try {

        if (!req.user?.id) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const parsed = validationParser(useAnalysis, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ success: false, error: "ValidationFailed", details: parsed.errors })
        }

        // creating a exmpty analysis
        const emptyAnalysis = await prisma.analysis.create({
            data: {
                resumeId: parsed.data.resumeId,
                jdId: parsed.data.jdId,
                userId: req.user?.id,
                status: "queued",
                progress: 0

            },
            select: { id: true }

        })

        // put these request to the queues , we using bullMQ here for quequing...
        analysisQueue(emptyAnalysis.id)
        return res.status(200).json({ success: true, analysisId: emptyAnalysis.id });


    } catch (error) {
        console.error("[POST api/analysis] Error:", error);
        return res.status(500).json({ success: false, error: "Something went wrong" });
    }
}




// POST /api/analysis/start
// export async function startAnalysis(req: Request, res: Response) {
//     try {
//         if (!req.user?.id) return res.status(401).json({ success: false, error: "Unauthorized" });

//         const { resumeId, jdId } = req.body; // these are DB ints you saved earlier
//         if (!resumeId || !jdId) return res.status(400).json({ success: false, error: "Missing resumeId/jdId" });

//         // Create empty analysis row
//         const analysis = await prisma.analysis.create({
//             data: {
//                 resumeId: Number(resumeId),
//                 jdId: Number(jdId),
//                 userId: Number(req.user.id),
//                 status: "queued",
//                 progress: 0
//             },
//             select: { id: true, publicId: true }
//         });

//         // Kick off the heavy work (fire-and-forget)
//         setImmediate(async () => {
//             try {
//                 await prisma.analysis.update({ where: { id: analysis.id }, data: { status: "processing", progress: 5 } });

//                 // fetch jd + fileName from DB
//                 const record = await prisma.analysis.findUnique({
//                     where: { id: analysis.id },
//                     include: { jd: true, resume: true }
//                 });
//                 if (!record) throw new Error("Analysis not found mid-run");

//                 // run your existing pipeline
//                 const result = await runAnalysis(record.jd.description, record.resume.fileName);

//                 if ((result as any).error) {
//                     await prisma.analysis.update({
//                         where: { id: analysis.id },
//                         data: { status: "failed", errorMessage: (result as any).error, progress: 100 }
//                     });
//                     return;
//                 }



//                 // persist results
//                 await prisma.analysis.update({
//                     where: { id: analysis.id },
//                     data: {
//                         status: "completed",
//                         progress: 100,
//                         matchScore: result.match_score,
//                         strengths: result.strengths,
//                         missingKeywords: result.missing_keywords,
//                         recommendations: result.recommendations,
//                         suggestedEdits: result.suggested_edits
//                     }
//                 });
//             } catch (err: any) {
//                 await prisma.analysis.update({
//                     where: { id: analysis.id },
//                     data: { status: "failed", errorMessage: err?.message || "Pipeline error", progress: 100 }
//                 });
//             }
//         });



//         return res.status(202).json({ success: true, analysisId: analysis.publicId }); // 202 Accepted
//     } catch (e) {
//         console.error("[POST /analysis/start] Error:", e);
//         return res.status(500).json({ success: false, error: "Something went wrong" });
//     }
// }
