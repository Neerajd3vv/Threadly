import { z } from "zod";
import { loginSchema } from "./validations/loginSchema";
import { signupSchema } from "./validations/signupSchema";
import React, { ComponentType, SVGProps } from "react";

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

export type BadgeType = {
    title: string;
    className?: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;

} & React.HTMLAttributes<HTMLDivElement>