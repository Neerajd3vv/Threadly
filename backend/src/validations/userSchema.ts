import { z } from "zod";

export const userSchema = z.object({
    firstname: z.string().min(1, "First name is required").max(20, "First name too long"),
    lastname: z.string().max(20, "Last name too long").optional().nullable(),
    email: z.email("Invalid email format"),
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Password must be at least 6 characters, include uppercase, lowercase, and a number"
    ),

});
