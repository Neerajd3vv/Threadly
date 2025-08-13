import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { validationParser } from "../utils/validationParser"
import { userSchema } from "../validations/userSchema"
import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { loginSchema } from "../validations/loginSchema"

export const signup = async (req: Request, res: Response) => {


    try {

        const parsed = validationParser(userSchema, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ error: "ValidationFailed", details: parsed.errors })
        }

        const hashedPass = await bcrypt.hash(parsed.data.password, 10)
        await prisma.user.create({
            data: {
                firstname: parsed.data.firstname,
                lastname: parsed.data.lastname,
                email: parsed.data.email,
                password: hashedPass
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfuly"
        });

    } catch (error) {
        console.error("[POST /api/auth/signup] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}



export const signin = async (req: Request, res: Response) => {

    try {

        const parsed = validationParser(loginSchema, req.body)

        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ error: "ValidationFailed", details: parsed.errors })
        }

        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email }
        });



        if (!user) {
            return res.status(404).json({
                success: false, error: "User not found!", errorCode: "EMAIL_NOT_FOUND"
            })
        }


        const comparePass = await bcrypt.compare(parsed.data.password, user.password)


        if (!comparePass) {
            return res.status(401).json({
                success: false,
                error: "password is incorrect",
                errorCode: "INVALID_PASSWORD"

            });
        }

        return res.status(200).json({
            success: true,
            message: "User found!",
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,

            }
        });


    } catch (error) {
        console.error("[POST /api/user/signin] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}