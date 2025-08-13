import NextAuth from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuthConfig";

const authHandler = NextAuth(nextAuthConfig)

export { authHandler as GET, authHandler as POST }