import { z } from "zod";

export const googleSigninSchema = z.object({
    firstname: z.string().min(1, "First name is required").max(20, "First name too long"),
    lastname: z.string().max(20, "Last name too long").optional().nullable(),
    email: z.email("Invalid email format"),
    imgUrl: z.string()

});
