import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Password must be at least 6 characters, include uppercase, lowercase, and a number"
    ),
});
