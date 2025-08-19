import { z } from "zod";

export const resumeSchema = z
    .instanceof(File)
    .refine((file) => ["application/pdf"].includes(file.type), {
        message: "Only PDF files are allowed",
    }).refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "File size exceeds 2MB",
    });

