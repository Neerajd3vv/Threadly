import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { validationParser } from "../utils/validationParser"
import { userSchema } from "../validations/userSchema"
import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { loginSchema } from "../validations/loginSchema"
import { googleSigninSchema } from "../validations/googleSigninSchema"
import jwt from "jsonwebtoken"

export const signup = async (req: Request, res: Response) => {


    try {

        const parsed = validationParser(userSchema, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ success: false, error: "ValidationFailed", details: parsed.errors })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: parsed.data.email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already exists",
                errorCode: "EMAIL_ALREADY_EXISTS"
            });
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
            return res.status(400).json({ success: false, error: "ValidationFailed", details: parsed.errors })
        }

        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email }
        });



        if (!user) {
            return res.status(404).json({
                success: false, error: "User not found!", errorCode: "EMAIL_NOT_FOUND"
            })
        }

        if (user.password) {

            const comparePass = await bcrypt.compare(parsed.data.password, user.password)

            if (!comparePass) {
                return res.status(401).json({
                    success: false,
                    error: "password is incorrect",
                    errorCode: "INVALID_PASSWORD"

                });
            }
            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET as string,
            );



            return res.status(200).json({
                success: true,
                message: "User found!",
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    imgUrl: user.imgUrl

                },
                accessToken
            });
        }

    } catch (error) {
        console.error("[POST /api/user/signin] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}


export const googleSignin = async (req: Request, res: Response) => {
    try {

        const parsed = validationParser(googleSigninSchema, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ success: false, error: "ValidationFailed", details: parsed.errors })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: parsed.data.email }
        });

        if (existingUser) {
            return res.status(200).json({ success: true, message: "User already exists", });
        }


        await prisma.user.create({
            data: {
                firstname: parsed.data.firstname,
                lastname: parsed.data.lastname,
                email: parsed.data.email,
                imgUrl: parsed.data.imgUrl
            }
        });


        return res.status(201).json({
            success: true,
            message: "User created successfuly"
        });


    } catch (error) {
        console.error("[POST /api/auth/googleSignin] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

