"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/validations/signupSchema";
import { SignupFormData } from "@/types";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { Loader2, } from "lucide-react";
import axios from "axios";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const router = useRouter()

    const handleGoogleSignIn = () => {
        setGoogleLoading(true);
        signIn("google", { callbackUrl: "/test-page" });
    };


    const { register, setError, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: SignupFormData) => {
        // sign-up logic
        console.log("Sign up data:", data);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signup`, {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
            })
            if (response.data.success) {
                router.push("/signin")
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data.error);
                setError("email", { type: "manual", message: error.response?.data.error })
                toast.error(error.response?.data.errorCode)
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="w-full max-w-lg border-1 border-[#212529]/25">
                <CardHeader className="space-y-1 text-center pb-6">
                    <div className="mx-auto w-12 h-12 bg-[#212529] rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl">Create account</CardTitle>
                    <CardDescription className="text-slate-600 font-grotesk">
                        Get started with your free account today
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Google Sign-up Button */}
                    <Button
                        onClick={handleGoogleSignIn}
                        variant="outline"
                        className="w-full h-11 cursor-pointer border-slate-200 hover:bg-slate-50 transition-colors bg-transparent"
                        type="button"
                    >
                        {googleLoading ? (
                            <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        ) : (
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {googleLoading ? "Connecting to Google..." : "Sign up with Google"}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500 font-medium">Or continue with email</span>
                        </div>
                    </div>

                    {/* Full Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Input type="text" placeholder="First name" {...register("firstname")} className="h-11" />
                                {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <Input type="text" placeholder="Last name" {...register("lastname")} className="h-11" />
                                {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Input type="email" placeholder="Email address" {...register("email")} className="h-11" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password")}
                                    className="h-11"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                >
                                    {showPassword ? (
                                        <LuEye />
                                    ) : (
                                        <LuEyeOff />
                                    )}
                                </span>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <Input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    placeholder="Confirm password"
                                    {...register("confirmPassword")}
                                    className="h-11"
                                />
                                <span
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                >
                                    {showPasswordConfirm ? (
                                        <LuEye />
                                    ) : (
                                        <LuEyeOff />
                                    )}
                                </span>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button className="w-full h-11 bg-[#212529] text-white font-medium" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="animate-spin w-6 h-6" />
                            ) :
                                "Create account"
                            }
                        </Button>
                    </form>

                    {/* Switch Link */}
                    <div className="text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{" "}
                            <a href="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}