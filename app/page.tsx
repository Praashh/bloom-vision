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
  Infinity as PhosphorInfinity,
  Coin,
  EnvelopeSimple,
  CurrencyDollar,
  Lightning,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import BuyMeCoffee from "@/components/ui/buy-me-coffee";

export default function BloomGenerator() {
  const [url, setUrl] = useState("");
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showCreditDialog, setShowCreditDialog] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setCurrentImage(null);

    const toastId = toast.loading("Analyzing your brand & generating asset...", {
      description: "This may take a moment.",
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentImage(data.imageUrl);
        update();
        toast.success("Asset generated successfully!", {
          id: toastId,
          description: "Your brand visual is ready to download.",
        });
      } else {
        console.error("Generation failed", data);
        if (data.error === "Insufficient Credits") {
          toast.error("Insufficient Credits", {
            id: toastId,
            description: "You've run out of credits. Please support us to get more!",
          });
          setShowCreditDialog(true);
        } else {
          toast.error(data.error || "Generation failed", {
            id: toastId,
            description: "Something went wrong during generation. Please try again.",
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", {
        id: toastId,
        description: "Could not connect to the server. Please check your connection and try again.",
      });
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
            <Button>
              <Coin className="w-4 h-4" />
              {session?.user.credit} credits
            </Button>
            <Link href="/history">
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
                      Bloom is generating...
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
              className="mt-16 max-w-3xl mx-auto"
            >
              <Card className="bg-zinc-950/40 border-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl">
                <CardContent className="p-4">
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
                          alt="Generated Marketing Image"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credit Limit Dialog */}
        <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
          <DialogContent className="sm:max-w-lg bg-zinc-950/95 backdrop-blur-2xl border-white/10 text-white rounded-2xl shadow-2xl">
            <DialogHeader className="text-center items-center">
              <div className="mx-auto mb-2 w-14 h-14 rounded-2xl bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                <Coin className="w-7 h-7 text-amber-400" weight="duotone" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">
                You&apos;re Out of Credits!
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-base mt-1">
                Please support us by buying a coffee to get more credits!
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-6 py-4">
              {/* BuyMeCoffee Widget */}
              <BuyMeCoffee
                classname="w-56 h-56 rounded-2xl border-white/10 my-0 py-8"
              />

              {/* Pricing Info */}
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <CurrencyDollar className="w-5 h-5 text-emerald-400" weight="bold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      $5 = 20 Credits
                    </p>
                    <p className="text-xs text-zinc-500">
                      Each generation costs 1 credit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Lightning className="w-5 h-5 text-violet-400" weight="bold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Note: This is a paid feature
                    </p>
                    <p className="text-xs text-zinc-500">
                      Support us to keep Bloom running
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Email */}
              <div className="flex items-center gap-2 text-sm text-white">
                <EnvelopeSimple className="w-4 h-4" />
                <span>
                  After sponsoring, mail at{" "}
                  <a
                    href="mailto:hello.praash@gmail.com"
                    className="text-white hover:underline font-medium "
                  >
                    hello.praash@gmail.com
                  </a>
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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

