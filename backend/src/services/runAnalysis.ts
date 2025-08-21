import { getResume } from "../utils/getResume";
import pdfParse from "pdf-parse"
import OpenAI from "openai";
import { ResponseOutputText } from "openai/resources/responses/responses";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export async function runAnalysis(jd: string, fileName: string) {


    try {
        const resumeBuffer = await getResume(fileName)

        let resumeText = "";

        if (fileName.endsWith(".pdf")) {
            const parsed = await pdfParse(resumeBuffer)
            resumeText = parsed.text
        }

        const prompt = `
        You are a resume analyzer.  Compare the following resume with the job description.
        Return JSON with:
        - match_score: % fit (0–100)
        - strengths: key areas where resume matches
        - missingKeywords
        - suggestedEdits: suggestions per sections

        Job Description:
        ${jd}

        Resume:
        ${resumeText}

        `;

        const analysis = await client.chat.completions.create({
            model: "gpt-5-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const json = analysis.choices[0].message.content;

        return JSON.parse(json!);


    } catch (error) {
        console.error("Error in runAnalysis:", error);
        throw error;
    }

}


