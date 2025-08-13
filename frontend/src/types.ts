import { z } from "zod";
import { loginSchema } from "./validations/loginSchema";
import { signupSchema } from "./validations/signupSchema";

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>