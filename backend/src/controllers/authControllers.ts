import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { validationParser } from "../utils/validationParser"
import { userSchema } from "../validations/userSchema"
import { Request, Response } from "express"
import bcrypt from "bcryptjs"

export const signup = async (req: Request, res: Response) => {

    try {

        const parsed = validationParser(userSchema, req.body)
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({ error: "ValidationFailed", details: parsed.errors })
        }

        const hashedPass = await bcrypt.hash(parsed.data.password, 10)
        const user = await prisma.user.create({
            data: {
                firstname: parsed.data.firstname,
                lastname: parsed.data.lastname,
                email: parsed.data.email,
                password: hashedPass
            }
        });

        return res.status(201).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("[POST /api/auth/signup] Error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}