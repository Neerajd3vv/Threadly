import { z } from "zod";

export const resumeSchema = z.object({
    jd: z
        .string().trim().refine((val) => {
            const wordCount = val.split(/\s+/).length
            return wordCount >= 200 && wordCount <= 1000
        }, {
            message: "Job description must be between 200 and 1000 words",
        }),

    fileName: z
        .string()
        .min(3, "Filename must be at least 3 characters long")
        .max(100, "Filename is too long")
});
