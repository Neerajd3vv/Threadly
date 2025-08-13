import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/validations/loginSchema"
import { signupSchema } from "@/validations/signupSchema";
import { SignupFormData } from "@/types";
import { LoginFormData } from "@/types";

export default function AuthPage({ type = "signin" }: { type?: "signin" | "signup" }) {

    const schema = type === "signin" ? loginSchema : signupSchema;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData | LoginFormData>({
        resolver: zodResolver(schema),

    })

    // submit handler 
    const onSubmit = async (data: SignupFormData | LoginFormData) => {
        if (type === "signin") {

        } else {

        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="w-full max-w-lg  border-1 border-[#212529]/25 ">
                <CardHeader className="space-y-1 text-center pb-6">
                    <div className="mx-auto w-12 h-12 bg-[#212529] rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-whi+ te" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    {/* <p>ResumeBoost</p> */}
                    <CardTitle className="text-2xl ">
                        {type === "signin" ? "Welcome back" : "Create account"}
                    </CardTitle>

                    <CardDescription className="text-slate-600 font-grotesk">
                        {type === "signin"
                            ? "Enter your credentials to access your account"
                            : "Get started with your free account today"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">

                    <Button
                        variant="outline"
                        className="w-full h-11 cursor-pointer border-slate-200 hover:bg-slate-50 transition-colors bg-transparent"
                        type="button"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500 font-medium">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {type === "signup" && (
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    type="text"
                                    placeholder="First name"
                                    className="h-11 "
                                    {...register("firstname")}
                                />
                                {errors.firstname && (
                                    <p className="text-red-500 text-sm">{errors.firstname.message as string}</p>
                                )}

                                <Input
                                    type="text"
                                    placeholder="Last name"
                                    className="h-11 "
                                    {...register("lastname")}
                                />

                                {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}

                            </div>
                        )}

                        <Input
                            type="email"
                            placeholder="Email address"
                            className="h-11 "
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            className="h-11 "
                        />

                        {type === "signup" && (
                            <Input
                                type="password"
                                placeholder="Confirm password"
                                className="h-11 "
                            />
                        )}

                        {type === "signin" && (
                            <div className="flex items-center justify-end text-sm">
                                {/* <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300" />
                                    <span className="text-slate-600">Remember me</span>
                                </label> */}
                                <a href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <Button
                            className="w-full cursor-pointer h-11 bg-[#212529] hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200"
                            type="submit"
                        >
                            {type === "signin" ? "Sign in" : "Create account"}
                        </Button>
                    </form>



                    <div className="text-center">
                        <p className="text-sm text-slate-600">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                            <a
                                href={type === "signin" ? "/signup" : "/signin"}
                                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                            >
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
