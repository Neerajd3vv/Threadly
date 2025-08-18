"use client"
import { useState, useRef } from "react"
import { Upload, FileText, Sparkles, ChevronRight, X, CheckCircle, FileSearch, Edit3, ArrowUpCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Badge from "@/components/ui/badge"
import { resumeSchema } from "@/validations/resumeUpload"

function Main() {
    const [jobDescription, setJobDescription] = useState("")
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null);

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
            console.log("file", file);

        } else {
            setError(result.error.message)
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
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleAnalyze = () => {
        // todo : add resume filename and jd to the db, if user is login , otherwise pro


    }



    return (
        <div className="min-h-screen bg-gradient-to-bl from-[#000000]  via-[#000814] to-[#000000] relative overflow-hidden">

            <div className="relative z-10 container mx-auto px-4 py-8">
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
                                        setJobDescription(e.target.value)
                                    }}
                                    maxLength={5000}
                                    className="w-full max-h-70 bg-transparent backdrop-blur-xl border border-white/20 rounded-lg px-4 py-3 text-stone-200 placeholder-stone resize-none transition-all duration-300 text-sm shadow-inner custom-scrollbar"

                                />

                                {/* Counter */}
                                <div className="absolute bottom-2 right-2 text-xs text-stone-400 bg-black/40 backdrop-blur-md rounded px-2 py-1 border border-white/10">
                                    {jobDescription.length}/5000
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
                                        <p className="text-xs text-stone-500 mt-2">PDF, DOC, DOCX (Max 10MB)</p>
                                    </div>

                                </div>
                            ) : (
                                /* Uploaded State */
                                <div className="bg-gradient-to-br from-black/30 via-zinc-900/20 to-stone-900/20 backdrop-blur-xl rounded-lg p-4 border border-white/10 shadow-inner">
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        {/* Left Section */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400/20 via-green-300/15 to-teal-400/12 backdrop-blur-xl rounded-lg flex items-center justify-center border border-emerald-400/30 shrink-0">
                                                <CheckCircle className=" h-4 w-4 sm:w-5 sm:h-5 text-emerald-300" />
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
                                            {/* Upload button */}
                                            {!error && (
                                                <Button
                                                    className="inline-flex h-8 items-center gap-2 px-3 py-2 
                                                bg-gradient-to-r from-emerald-500/20 via-green-400/15 to-emerald-400/12
                                                backdrop-blur-xl rounded-md border border-emerald-400/30
                                                text-emerald-300 text-sm font-medium
                                                hover:from-emerald-500/30 hover:via-green-400/25 hover:to-emerald-400/20
                                                hover:scale-105 hover:shadow-[0_0_10px_rgba(16,185,129,0.4)]
                                                transition-all duration-300 cursor-pointer"
                                                >
                                                    <ArrowUpCircle className="w-4 h-4" />
                                                    Upload
                                                </Button>
                                            )}


                                            {/* Remove button */}
                                            <Button
                                                onClick={removeFile}
                                                className="w-8 h-8 bg-gradient-to-br from-red-500/20 via-rose-400/15 to-red-400/12 backdrop-blur-xl 
                                                hover:from-red-500/30 hover:via-rose-400/25 hover:to-red-400/20 
                                                rounded-md flex items-center justify-center transition-all duration-300 
                                                border border-red-400/30 hover:scale-105 cursor-pointer"
                                            >
                                                <X className="w-4 h-4 text-red-300" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>


                            )}
                        </div>
                    </div>


                    <div className="text-center pt-4">
                        <Button
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
                            <>
                                <Sparkles className="w-4 h-4" />
                                Analyze Match
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                        </Button>


                        <p className="text-stone-400 text-xs mt-3">Ready to analyze your resume</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
