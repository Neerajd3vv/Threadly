import { getResume } from "../utils/getResume";
import pdfParse from "pdf-parse"
import OpenAI from "openai";

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


        // check for resumes words limit, if too short its not resume..
        if (!resumeText && resumeText.trim().split(/\s+/).length < 100) {
            return {
                success: false,
                error: "Resume too short: Upload a complete resume",
            };
        }

        // check for resume common key words...

        const resumeLikeKeywords = [
            "experience",
            "education",
            "skills",
            "projects",
            "summary",
            "work history",
            "certifications",
        ];

        const keywordExists = resumeLikeKeywords.some((k) => resumeText.toLowerCase().includes(k))

        if (!keywordExists) {
            return {
                success: false,
                error: "Invalid file: Please upload a valid resume",
            };
        }


        const prompt = `
        You are an expert career consultant and recruiter. 
        Analyze the following resume against the provided job description.

        Return ONLY valid JSON with the exact structure below. 
        Do not include explanations or extra text outside of JSON.

        {
        "match_score": "number (0-100) indicating overall % fit between resume and job description",
        "strengths": ["bullet points highlighting strong alignment with the JD"],
        "missing_keywords": ["list of important skills, tools, or keywords present in the JD but missing in the resume (only keywords/phrases, no sentences)"],
        "recommendations": ["practical recruiter-style suggestions to improve alignment, e.g. highlight results, add missing domain-specific skills, refine achievements"],
        "suggested_edits": {
            "summary": "rewritten professional summary aligned to the JD",
            "experience_bullets": ["2–4 improved bullet points tailored to the JD"],
            "skills_section": ["optimized list of skills directly tied to JD requirements"]
        }
        }

        Rules:
        - The analysis should adapt to any domain (tech, sales, finance, marketing, healthcare, etc.).
        - missing_keywords must be keywords/skills only (no explanatory text).
        - recommendations should be realistic and applicable in the real world, not generic.
        - skills_section should be well-structured and natural for the specific JD domain, but not forced into predefined buckets.
        - Always return valid JSON.
  
        Job Description:
        ${jd}

        Resume:
        ${resumeText}
`


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


