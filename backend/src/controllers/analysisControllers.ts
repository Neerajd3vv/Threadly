
import { redis } from "../lib/redisClient"
import { Request, Response } from "express"
import { runAnalysis } from "../services/runAnalysis";
import { resumeSchema } from "../validations/resumeSchema";
import { validationParser } from "../utils/validationParser";
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

        if (!analysis) {
            return res
                .status(500)
                .json({ success: false, error: "Analysis failed to produce result" });
        }

        return res.status(200).json({ success: true, analysis });


    } catch (error) {
        console.error("[POST /api/analysis/guest] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }

}


export async function analysis(req: Request, res: Response) {
    try {
        const parsed = validationParser(resumeSchema, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ success: false, error: "ValidationFailed", details: parsed.errors })
        }

        const analysis = await runAnalysis(parsed.data.jd, parsed.data.fileName)
        if (!analysis) {
            return res
                .status(500)
                .json({ success: false, error: "Analysis failed to produce result" });
        }

        return res.status(200).json({ success: true, analysis });


    } catch (error) {

    }
}