import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import axios from "axios";

export const nextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", placeholder: "Enter your email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    console.log("credentials", credentials);

                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signin`, {
                        email: credentials?.email,
                        password: credentials?.password
                    })
                    console.log("response", response);


                    if (response.data?.success) {
                        return response.data.user;
                    }

                    throw new Error(JSON.stringify({
                        message: response.data.error,
                        field: response.data.errorCode === "EMAIL_NOT_FOUND" ? "email" : "password"
                    }));



                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log(error.response?.status, error.response?.data?.error);
                        throw new Error(JSON.stringify({
                            message: error.response?.data.error || "Login failed",
                            field: error.response?.data?.errorCode === "EMAIL_NOT_FOUND" ? "email" : "password"
                        }))

                    }
                    throw new Error("Something went wrong");

                }

            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin"
    }
}
