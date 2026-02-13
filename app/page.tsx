"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DownloadSimple,
  CircleNotch,
  ClockCounterClockwise,
  ArrowRight,
  Sparkle,
  Globe,
  Infinity as PhosphorInfinity
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function BloomGenerator() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [brandInfo, setBrandInfo] = useState<{
    company_name: string;
    brand_colors: string;
    visual_style: string;
    description: string;
    suggested_image_prompt: string;
  } | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setCurrentImage(null);
    setBrandInfo(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentImage(data.imageUrl);
        setBrandInfo(data.brandInfo);
      } else {
        console.error("Generation failed", data);
        alert("Error: " + (data.error || "Generation failed"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans overflow-x-hidden dark">
      {/* Background Image - Clean version without gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Image
          src="/bg.png"
          alt="Bloom Background"
          fill
          priority
          className="object-cover opacity-60 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/40 to-background/80" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-24 min-h-screen">
        {/* Navigation/Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <PhosphorInfinity className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Bloom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-xl bg-background/20 backdrop-blur-md border-white/10 hover:bg-background/40 transition-all">
                <ClockCounterClockwise className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 mb-20 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Enter your site URL. <br />
              <span className="text-white italic">Bloom does the rest.</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Create stunning, on-brand visuals with ease. Just start with your website.
            </p>
          </motion.div>

          {/* URL Input Area */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleGenerate}
            className="w-full max-w-3xl relative mt-4"
          >
            <div className="relative group p-1  rounded-2xl">
              <div className="relative flex items-center bg-zinc-950/80 border border-white/5 rounded-[14px] p-2 pl-6 backdrop-blur-2xl">
                <Globe className="w-5 h-5 text-zinc-500 mr-3" />
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-business-site.com"
                  className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 h-14 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="h-14 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-base transition-all active:scale-95 shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <CircleNotch className="w-5 h-5 animate-spin mr-2" />
                      Bloom is Crawling...
                    </>
                  ) : (
                    <>
                      Generate
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.form>
        </div>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {(currentImage || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-16 max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                <Card className="md:col-span-7 bg-zinc-950/40 border-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl">
                  <CardContent className="p-4 h-full">
                    <div className="aspect-square w-full relative bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5">
                      {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                          <div className="relative h-24 w-24">
                            <div className="absolute inset-0 border-[3px] border-indigo-500/10 rounded-full" />
                            <Sparkle className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                          </div>
                          <div className="space-y-2 text-center">
                            <p className="text-xl font-medium text-white">Analyzing your brand...</p>
                            <p className="text-sm text-zinc-400">Our AI is brewing something magical</p>
                          </div>
                        </div>
                      ) : currentImage && (
                        <>
                          <Image
                            src={currentImage}
                            alt={brandInfo?.company_name || "Marketing Image"}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                          <div className="absolute bottom-6 right-6 flex gap-3">
                            <Button asChild size="icon" className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white transition-all">
                              <a href={currentImage} download>
                                <DownloadSimple className="w-6 h-6" />
                              </a>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="md:col-span-5 flex flex-col gap-6">
                  {isLoading ? (
                    <Card className="h-full bg-zinc-950/40 border-white/5 backdrop-blur-xl rounded-[2rem] p-8 space-y-8">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-20 bg-white/5" />
                        <Skeleton className="h-10 w-3/4 bg-white/10" />
                      </div>
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-24 bg-white/5" />
                        <Skeleton className="h-6 w-full bg-white/5" />
                        <Skeleton className="h-6 w-5/6 bg-white/5" />
                      </div>
                      <div className="space-y-3 pt-6 border-t border-white/5">
                        <Skeleton className="h-4 w-32 bg-white/5" />
                        <Skeleton className="h-16 w-full bg-white/5" />
                      </div>
                    </Card>
                  ) : brandInfo && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="h-full bg-zinc-950/40 border-white/5 backdrop-blur-xl rounded-[2rem] p-8 space-y-8 flex flex-col justify-between"
                    >
                      <div className="space-y-6">
                        <div>
                          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-none mb-3">Company</Badge>
                          <h2 className="text-3xl font-bold text-white">{brandInfo.company_name}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Visual Theme</p>
                            <p className="text-sm text-zinc-200 font-medium">{brandInfo.visual_style}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Brand Colors</p>
                            <p className="text-sm text-zinc-200 font-medium">{brandInfo.brand_colors}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</p>
                          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4">{brandInfo.description}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkle className="w-3 h-3 text-indigo-400" weight="duotone" />
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">AI Prompt Generation</p>
                        </div>
                        <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                          <p className="text-zinc-200 text-xs italic leading-relaxed">{brandInfo.suggested_image_prompt}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info/Disclaimer */}
        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-white text-sm">
            Built by <Link href={"https://x.com/10xpraash"} target="_blank">Praash</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}

