import { z } from "zod";

export const analyseSchema = z.object({
    jd: z.string().refine(value => value.length <= 5000, "JD exceeds 5000 words limit."),
    resume: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "File size exceeds 5MB.",
        })
        .refine((file) => ["application/pdf"].includes(file.type), {
            message: "Only PDF files are allowed.",
        });
}) 