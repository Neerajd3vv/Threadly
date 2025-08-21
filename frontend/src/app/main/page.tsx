"use client"
import { useState, useRef } from "react"
import { Upload, FileText, Sparkles, ChevronRight, X, CheckCircle, FileSearch, Edit3, ArrowUpCircle, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import { resumeSchema } from "@/validations/resumeUpload"
import { TbRefresh } from "react-icons/tb";
import { useSession } from "next-auth/react"
import axios from "axios"
import { toast } from "sonner"

function Main() {
    const [jobDescription, setJobDescription] = useState("")
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession()


    // upload states
    const [isUploading, setIsUploading] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)

    const [isAnalysing, setIsAnalysing] = useState(false)

    const [uploadError, setUploadError] = useState<string | null>(null)
    const [guestSessionId, setGuestSessionId] = useState<string | null>(null)

    const [savedfileName, setSavedFileName] = useState<string | null>(null)

    // const [isDarkMode, setIsDarkMode] = useState(true)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // const toggleTheme = () => {
    //     setIsDarkMode(!isDarkMode)
    // }



    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        setError(null)
        const file = e.dataTransfer.files?.[0]
        if (!file) return;
        const result = resumeSchema.safeParse(file)
        if (result.success) {

        } else {
            setError(result.error.issues[0].message)
        }
        setUploadedFile(file)


    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null)
        const file = e.target.files?.[0]
        if (!file) return;
        const result = resumeSchema.safeParse(file)
        if (result.success) {

        } else {
            setError(result.error.issues[0].message)

        }
        setUploadedFile(file)

    }

    const removeFile = () => {
        setUploadedFile(null)
        setIsUploaded(false)
        setUploadError(null)
        setIsUploading(false)
        setError(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleUpload = async (fileName: string, fileType: string) => {
        if (jobDescription.trim().split(/\s+/).length < 100) {
            toast.custom(() => (
                <div className="max-w-md w-full rounded-xl shadow-lg backdrop-blur-md 
                      bg-gradient-to-tr from-[#000000] via-indigo-900/10 to-zinc-900/5 
                      border border-white/10 text-white px-4 py-3">
                    <p className="text-sm font-medium">
                        ⚠️ Please provide JD with minimum of 100 words!
                    </p>
                </div>
            ), { duration: 4000 });
            return;
        }

        setIsUploading(true);

        try {
            //  Ask backend for signed URL
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/upload/resume`,
                { fileName, fileType });

            if (response.data.success) {
                const { signedUrl, fileName } = response.data;

                //  Upload file to GCP
                await axios.put(signedUrl, uploadedFile, {
                    headers: {
                        "Content-Type": uploadedFile?.type || "application/pdf",
                    },
                });

                //  If user is logged in → save to DB
                if (session) {
                    const payload = { jd: jobDescription, fileName };
                    const res2 = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/upload/jd-resume`,
                        payload,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${session.user.accessToken}`,
                            },
                        }
                    );
                    if (res2.data.success) {
                        setIsUploaded(true);
                        setSavedFileName(fileName)

                    }
                } else {
                    //  Guest → directly analyze
                    const payload = { jd: jobDescription, fileName };
                    const res2 = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/upload/jd-resume/guest`,
                        payload,
                        { headers: { "Content-Type": "application/json" } }
                    );
                    if (res2.data.success) {
                        setIsUploaded(true);
                        setSavedFileName(fileName)
                        console.log("guest-seesion-id-frontend", res2.data.guestSesssionId);

                        setGuestSessionId(res2.data.guestSessionId)
                    }
                }

            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Upload error", error.response?.data || error.message);
                setUploadError(error.response?.data?.error || "Upload failed");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleAnalyze = async () => {
        try {
            setIsAnalysing(true)
            if (session) {
                const payload = { jd: jobDescription, savedfileName };
                const res2 = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/analysis/jd-resume`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.user.accessToken}`,
                        },
                    }
                );
                if (res2.data.success) {
                    console.log(" analysis result:", res2.data.analysis);


                }
            } else {
                //  Guest → directly analyze
                const res2 = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/analysis/guest`,
                    { guestSessionId },
                    { headers: { "Content-Type": "application/json" } }
                );
                if (res2.data.success) {
                    console.log("Guest analysis result:", res2.data.analysis);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Upload error", error.response?.data || error.message);
                setUploadError(error.response?.data?.error || "Anlysis failed");
            }

        } finally {
            setIsAnalysing(false)
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-bl from-[#000000]  via-[#000814] to-[#000000] relative overflow-hidden">

            <div className="relative  z-10 container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        {/* <button
                            onClick={toggleTheme}
                            className={``}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button> */}
                        <Badge title="AI-Powered Analysis" icon={Sparkles} />
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-zinc-50 via-stone-200 to-zinc-100 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                        >
                            Resume Analyzer
                        </h1>

                        <p className="text-sm text-stone-400 max-w-lg mx-auto bg-gradient-to-r from-white/10 via-white/5 to-transparent px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5"
                        >
                            Upload your resume and job description for intelligent matching insights
                        </p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent " />

                        <div className=" flex flex-wrap justify-center gap-3 mb-10">
                            <Badge
                                title="Match Score (0–100%)"
                                icon={CheckCircle}
                                className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            />
                            <Badge
                                title="Missing Keywords & Skills"
                                icon={FileSearch}
                                className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                            />

                            <Badge
                                title="Suggested Rewrites"
                                icon={Edit3}
                                className="bg-amber-500/10 text-amber-300 border border-amber-500/20"

                            />
                        </div>

                    </div>


                    <div className="w-full">
                        <div className=" bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-white/[0.01]  rounded-xl border border-white/10 p-6  hover:shadow-[0_0_40px_rgba(80,0,120,0.2)] transition-all duration-300">

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-tr from-white/10 via-stone-50/12 to-zinc-100/8  rounded-lg flex items-center justify-center border border-white/10 shadow-inner">
                                    <FileText className="w-4 h-4 text-stone-200" />
                                </div>
                                <h2 className="text-lg font-semibold bg-gradient-to-r from-stone-200 via-stone-100 to-zinc-300 bg-clip-text text-transparent">
                                    Job Description
                                </h2>
                            </div>

                            {/* Textarea */}
                            <div className="relative">
                                <Textarea
                                    onChange={(e) => {
                                        const wordsCount = e.target.value.trim() === "" ? 0 : e.target.value.trim().split(/\s+/).length

                                        if (wordsCount <= 1000) {
                                            setJobDescription(e.target.value)
                                        }

                                    }}
                                    className="w-full max-h-70 bg-transparent backdrop-blur-xl border border-white/20 rounded-lg px-4 py-3 text-stone-200 placeholder-stone resize-none transition-all duration-300 text-sm shadow-inner custom-scrollbar"

                                />

                                {/* Counter */}
                                <div className="absolute bottom-2 right-2 text-xs text-stone-400 bg-black/40 backdrop-blur-md rounded px-2 py-1 border border-white/10">
                                    {jobDescription.trim() === "" ? 0 : jobDescription.trim().split(/\s+/).length}/1000
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="w-full">
                        <div className="bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-white/[0.01]  rounded-xl border border-white/10 p-6  hover:shadow-[0_0_40px_rgba(80,0,120,0.2)] transition-all duration-300">

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-tr from-white/10 via-stone-50/12 to-zinc-100/8  rounded-lg flex items-center justify-center border border-white/10 shadow-inner">
                                    <Upload className="w-4 h-4 text-stone-200" />
                                </div>

                                <h2 className="text-lg font-semibold bg-gradient-to-r from-stone-200 via-stone-100 to-zinc-300 bg-clip-text text-transparent">
                                    Resume Upload
                                </h2>
                                {error && <p className="text-red-400 text-sm ">{error}</p>}
                                {uploadError && <p className="text-red-400 text-sm ">{uploadError}</p>}
                            </div>

                            {/* Dropzone */}
                            {!uploadedFile ? (
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragging
                                        ? "border-[#000814] bg-[#000814] backdrop-blur-xl scale-[1.01]"
                                        : "border-white/15 hover:border-purple-400/40 hover:bg-gradient-to-tr hover:from-[#000000] hover:via-indigo-900/10 hover:to-zinc-900/5 backdrop-blur-xl"
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    <div className={`transition-transform duration-500 ${isDragging ? "scale-105" : ""} space-y-3`}>
                                        {/* Upload Icon */}
                                        <div className="w-12 h-12 bg-gradient-to-tr from-white/10 via-stone-50/12 to-zinc-100/8  rounded-lg flex items-center justify-center mx-auto border border-white/10">
                                            <Upload className="w-6 h-6 text-stone-200" />
                                        </div>

                                        {/* Text */}
                                        <div className="space-y-1">
                                            <h3 className="text-base font-semibold bg-gradient-to-r from-stone-200 via-stone-100 to-zinc-300 bg-clip-text text-transparent">
                                                {isDragging ? "Drop here" : "Upload Resume"}
                                            </h3>
                                            <p className="text-stone-400 text-sm">Drag & drop or click to browse</p>
                                        </div>


                                        {/* Button */}
                                        <Button

                                            size={"lg"}
                                            className="cursor-pointer overflow-hidden rounded-lg 
                                            border border-white/20
                                            bg-gradient-to-tr from-[#0a0a0f] via-[#111827] to-[#0f172a] text-stone-200 hover:scale-105 hover:text-white  transition-all duration-300"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Choose File

                                        </Button>





                                        {/* File Type Info */}
                                        <p className="text-xs text-stone-500 mt-2">Only PDF (Max 2MB)</p>
                                    </div>

                                </div>
                            ) : (
                                /* Uploaded State */
                                <div className="bg-gradient-to-br from-black/30 via-zinc-900/20 to-stone-900/20 backdrop-blur-xl rounded-lg p-4 border border-white/10 shadow-inner">
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        {/* Left Section */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400/20 via-green-300/15 to-teal-400/12 backdrop-blur-xl rounded-lg flex items-center justify-center border border-emerald-400/30 shrink-0">
                                                {isUploaded ? (
                                                    <CheckCircle className="h-4 w-4 sm:w-5 sm:h-5 text-emerald-300" />
                                                ) : isUploading ? (
                                                    <div className="flex space-x-1">
                                                        <span className="w-1 h-1 bg-emerald-300 rounded-full animate-bounce"></span>
                                                        <span className="w-1 h-1 bg-emerald-300 rounded-full animate-bounce200"></span>
                                                        <span className="w-1 h-1 bg-emerald-300 rounded-full animate-bounce400"></span>
                                                    </div>
                                                ) : (
                                                    <ArrowUpCircle className="h-4 w-4 text-emerald-300" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-stone-200 font-medium text-sm truncate max-w-[180px] sm:max-w-full">
                                                    {uploadedFile.name}
                                                </h4>
                                                <p className="text-stone-500 text-xs">
                                                    {(uploadedFile.size / 1024 / 1024) < 1
                                                        ? `${(uploadedFile.size / 1024).toFixed(2)} KB`
                                                        : `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Section - Action buttons */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Upload / Uploaded / Retry Button */}
                                            {
                                                !error && (
                                                    <Button
                                                        onClick={() => {
                                                            if (!isUploaded) handleUpload(uploadedFile.name, uploadedFile.type)
                                                        }}
                                                        disabled={isUploading || isUploaded}
                                                        className={`inline-flex w-28 h-8 items-center gap-2 px-3 py-2
                                                        bg-gradient-to-tr from-[#000000] via-indigo-900/10 to-zinc-900/5 
                                                        backdrop-blur-xl rounded-md border border-white/20
                                                        text-emerald-300 text-sm font-medium
                                                        transition-all duration-300 ease-in-out
                                                        hover:from-emerald-900/30 hover:via-indigo-800/20 hover:to-zinc-800/10
                                                        hover:text-emerald-200 hover:shadow-lg cursor-pointer
                                                ${isUploading || isUploaded ? 'opacity-70 cursor-not-allowed' : ''}
        `}
                                                    >
                                                        {isUploading ? (
                                                            <div className="flex space-x-2 items-center">
                                                                {[0, 1, 2].map((i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="w-2 h-2 bg-white rounded-full animate-pulse"
                                                                        style={{ animationDelay: `${i * 0.5}s` }}
                                                                    ></span>
                                                                ))}
                                                            </div>


                                                        ) : isUploaded ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                Uploaded
                                                            </>
                                                        ) : uploadError ? (
                                                            <>
                                                                <TbRefresh className="w-4 h-4" />
                                                                Retry
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ArrowUpCircle className="w-4 h-4" />
                                                                Upload
                                                            </>
                                                        )}
                                                    </Button>
                                                )
                                            }


                                            {/* Remove button */}

                                            <X onClick={removeFile} className="w-5 h-5 cursor-pointer text-gray-100 hover:text-white hover:scale-125 transition-all duration-300" />
                                        </div>
                                    </div>
                                </div>



                            )}
                        </div>
                    </div>


                    <div className="text-center pt-4">
                        <Button
                            disabled={!isUploaded || isAnalysing}
                            size="xl"
                            onClick={handleAnalyze}
                            className="relative cursor-pointer overflow-hidden rounded-lg
                            border border-white/20
                            bg-gradient-to-tr from-[#0a0a0f] via-[#111827] to-[#0f172a]
                            text-white font-semibold
                            hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]
                            hover:from-cyan-600  hover:via-blue-700 hover:to-indigo-800
                            hover:border-none transition-all duration-300"
                        >
                            {isAnalysing ? (
                                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Analyze Match
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </>
                            )}
                        </Button>


                        {!isUploaded ? (
                            <p className="text-stone-400 text-xs mt-3">
                                Upload resume first
                            </p>
                        ) : (
                            <p className="text-stone-400 text-xs mt-3">Ready to analyze your resume</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Main
