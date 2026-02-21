"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as PhosphorImage,
  DownloadSimple,
  ClockCounterClockwise,
  CaretLeft,
  Infinity as PhosphorInfinity,
  DotsThreeVertical,
  Trash,
  SquaresFour,
  List as PhosphorList,
  Eye,
  Calendar,
  Plus,
  ArrowRight,
  CloudArrowUp,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatTimeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function History() {
  const [images, setImages] = useState<{ url: string; name: string; time: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Failed to fetch images", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans overflow-x-hidden dark">
      {/* Background Image - Matching landing page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Image
          src="/bg.png"
          alt="Bloom Background"
          fill
          priority
          className="object-cover opacity-40 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24 min-h-screen">
        {/* Navigation/Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-5">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all backdrop-blur-sm"
              >
                <CaretLeft size={18} weight="bold" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <PhosphorInfinity size={22} className="text-primary-foreground" weight="bold" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  History
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm">
              <span className="w-2 h-2 bg-white rounded-full " />
              <span className="text-xs font-semibold text-zinc-400">
                {images.length} <span className="text-zinc-500">Generations</span>
              </span>
            </div>
            <Link href="/">
              <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl h-10 px-5 font-bold text-sm shadow-lg shadow-white/5 gap-2 transition-all active:scale-95">
                <Plus size={16} weight="bold" />
                New Asset
              </Button>
            </Link>
          </div>
        </motion.header>

        <Tabs defaultValue="grid" className="space-y-8">
          {/* Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center backdrop-blur-sm">
                <ClockCounterClockwise size={20} className="text-zinc-400" weight="duotone" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Generation History</h3>
                <p className="text-xs text-zinc-500">Your visual asset library</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TabsList className="bg-white/5 border border-white/5 p-1 rounded-xl h-10 backdrop-blur-sm">
                <TabsTrigger
                  value="grid"
                  className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none text-zinc-500 h-8 px-3 transition-all"
                >
                  <SquaresFour size={16} weight="duotone" />
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none text-zinc-500 h-8 px-3 transition-all"
                >
                  <PhosphorList size={16} weight="duotone" />
                </TabsTrigger>
              </TabsList>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="space-y-4"
                >
                  <div className="aspect-square w-full rounded-2xl bg-white/5 border border-white/5 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent animate-pulse" />
                  </div>
                  <div className="space-y-2 px-1">
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                    <Skeleton className="h-3 w-1/2 bg-white/[0.03]" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative py-24 flex flex-col items-center justify-center gap-8 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-[100px]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>

              {/* Floating grid pattern */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}
              />

              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl shadow-indigo-500/5">
                  <CloudArrowUp size={40} weight="duotone" className="text-zinc-500" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-indigo-500/10 rounded-full blur-md" />
              </motion.div>

              <div className="text-center space-y-3 relative z-10">
                <p className="text-2xl font-bold text-white">Your gallery is empty</p>
                <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Start creating stunning, on-brand visuals using our AI-powered generation engine.
                </p>
              </div>

              <Link href="/">
                <Button className="mt-2 px-8 h-12 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 gap-2.5 text-sm">
                  Create First Asset
                  <ArrowRight size={16} weight="bold" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {images.map((img, idx) => (
                      <motion.div
                        key={img.url}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        layout
                      >
                        <Card
                          className="group relative bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-500 cursor-pointer backdrop-blur-sm hover:bg-white/[0.06]"
                          onClick={() => setSelectedImage({ url: img.url, name: img.name })}
                        >
                          <CardContent className="p-2.5">
                            <div className="aspect-square w-full relative bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5">
                              <Image
                                src={img.url}
                                alt={img.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                              />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
                                <div className="flex justify-end">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <DotsThreeVertical size={18} weight="bold" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-44 bg-zinc-900/95 border-white/10 text-zinc-300 rounded-xl shadow-2xl backdrop-blur-xl p-1"
                                    >
                                      <DropdownMenuItem
                                        className="focus:bg-white/10 focus:text-white rounded-lg py-2 gap-2 text-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedImage({ url: img.url, name: img.name });
                                        }}
                                      >
                                        <Eye size={16} weight="duotone" />
                                        Quick View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="focus:bg-white/10 focus:text-white rounded-lg py-2 gap-2 text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <PhosphorImage size={16} weight="duotone" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-400 focus:bg-red-500/10 focus:text-red-400 rounded-lg font-medium py-2 gap-2 text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Trash size={16} weight="duotone" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={img.url}
                                      download
                                      className="flex-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-lg font-bold h-10 shadow-lg gap-2 text-sm transition-all active:scale-95">
                                        <DownloadSimple size={16} weight="bold" />
                                        Download
                                      </Button>
                                    </a>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage({ url: img.url, name: img.name });
                                      }}
                                    >
                                      <Eye size={18} weight="duotone" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3.5 px-1.5 pb-1.5 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-zinc-200 truncate max-w-[140px]">
                                  {img.name.split(".")[0]}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-[8px] bg-white/5 border-white/10 text-zinc-500 h-5 px-1.5 rounded-md font-bold uppercase tracking-wider"
                                >
                                  PNG
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                                <span className="flex items-center gap-1.5 font-medium">
                                  Bloom Vision
                                </span>
                                <span>{formatTimeAgo(img.time)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-white/5">
                        <TableHead className="w-[80px] font-bold text-zinc-500 text-xs uppercase tracking-wider">
                          Preview
                        </TableHead>
                        <TableHead className="font-bold text-zinc-500 text-xs uppercase tracking-wider">
                          Asset Name
                        </TableHead>
                        <TableHead className="font-bold text-zinc-500 text-xs uppercase tracking-wider">
                          Status
                        </TableHead>
                        <TableHead className="font-bold text-zinc-500 text-xs uppercase tracking-wider">
                          Date
                        </TableHead>
                        <TableHead className="text-right font-bold text-zinc-500 text-xs uppercase tracking-wider">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {images.map((img, idx) => (
                        <motion.tr
                          key={img.url}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-white/[0.03] transition-colors border-white/5 group"
                        >
                          <TableCell>
                            <div
                              className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-zinc-900/50 relative cursor-pointer group-hover:border-white/20 transition-all"
                              onClick={() => setSelectedImage({ url: img.url, name: img.name })}
                            >
                              <Image
                                src={img.url}
                                alt={img.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                unoptimized
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-zinc-200 font-semibold text-sm">
                                {img.name.split(".")[0]}
                              </span>
                              <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                                PNG Format
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold text-[10px] h-6"
                            >
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5" />
                              Ready
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-500 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-zinc-600" weight="duotone" />
                              <span className="text-xs">
                                {new Date().toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="rounded-lg h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10"
                              >
                                <a href={img.url} download>
                                  <DownloadSimple size={16} weight="bold" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10"
                                onClick={() => setSelectedImage({ url: img.url, name: img.name })}
                              >
                                <Eye size={16} weight="duotone" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-lg h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10"
                                  >
                                    <DotsThreeVertical size={16} weight="bold" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-44 bg-zinc-900/95 border-white/10 text-zinc-300 rounded-xl shadow-2xl backdrop-blur-xl p-1"
                                >
                                  <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-400 rounded-lg py-2 gap-2 font-medium text-sm">
                                    <Trash size={16} weight="duotone" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-zinc-950/95 backdrop-blur-2xl border-white/10 rounded-2xl shadow-2xl">
            <DialogHeader className="p-5 pb-0 absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <DialogTitle className="text-lg font-bold text-white pointer-events-auto flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <PhosphorImage size={18} weight="duotone" className="text-zinc-400" />
                  {selectedImage?.name.split(".")[0]}
                </span>
                {selectedImage && (
                  <a href={selectedImage.url} download className="pointer-events-auto">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-zinc-200 h-9 rounded-xl px-4 font-bold gap-2 transition-all active:scale-95"
                    >
                      <DownloadSimple size={16} weight="bold" />
                      Download
                    </Button>
                  </a>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-square w-full relative bg-zinc-950">
              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center">
        <p className="text-zinc-600 text-sm font-medium">
          Built by{" "}
          <Link
            href="https://x.com/10xpraash"
            target="_blank"
            className="text-zinc-400 hover:text-white transition-colors font-bold"
          >
            Praash
          </Link>
        </p>
      </footer>
    </div>
  );
}
