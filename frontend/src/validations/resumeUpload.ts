import { z } from "zod";

export const resumeSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "File size exceeds 5MB",
    })
    .refine((file) => ["application/pdf"].includes(file.type), {
        message: "Only PDF files are allowed",
    });

