import { z } from "zod";

export const signupSchema = z.object({
    firstname: z.string().min(1, "First name is required").max(20, "First name too long"),
    lastname: z.string().max(20, "Last name too long").optional().nullable(),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required")
        .min(6, "Password must be at least 6 characters").regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
            "Password must be at least 6 characters, include uppercase, lowercase, and a number"
        ),
    confirmPassword: z.string().min(1, "confirm-password is required")
        .min(6, "confirm-password must be at least 6 characters")

}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
});

