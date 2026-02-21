"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkle } from "@phosphor-icons/react";

function SignInContent() {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/history";

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { callbackUrl });
        } catch {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            {/* Left Side — Background Image */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                <Image
                    src="/background.png"
                    alt="Bloom Vision"
                    fill
                    className="object-cover"
                    priority
                    quality={95}
                />
                {/* Gradient overlay on the right edge of the image for smooth blending */}
                <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#0a0a0f] to-transparent z-10" />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#0a0a0f] to-transparent z-10" />
                {/* Top gradient */}
                <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-[#0a0a0f]/60 to-transparent z-10" />

                {/* Branding overlay at bottom-left */}
                <div className="absolute bottom-10 left-10 z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-white/90 text-xl font-bold tracking-tight">
                                Bloom Vision
                            </span>
                        </div>
                        <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                            Imagine anything. Bloom will paint it. High-quality image generation powered by AI.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side — Sign In Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 relative">
                {/* Ambient glow effects */}
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Mobile branding */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">

                        <span className="text-white/90 text-xl font-bold tracking-tight">
                            Bloom Vision
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3"
                        >
                            Welcome back
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-white/40 text-base"
                        >
                            Sign in to your account to continue creating
                        </motion.p>
                    </div>

                    {/* Sign In Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="bg-white/3 backdrop-blur-xl rounded-2xl border border-white/6 p-8 shadow-2xl shadow-black/20"
                    >
                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full group relative flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            )}
                            <span className="text-[15px]">
                                {isLoading ? "Signing in..." : "Continue with Google"}
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-white/6" />
                            <span className="text-white/20 text-xs font-medium uppercase tracking-widest">
                                or
                            </span>
                            <div className="flex-1 h-px bg-white/6" />
                        </div>

                        {/* Info text */}
                        <p className="text-center text-white/30 text-sm leading-relaxed">
                            We use Google for secure authentication. No passwords needed — just your Google account.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen bg-[#0a0a0f] items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
        }>
            <SignInContent />
        </Suspense>
    );
}