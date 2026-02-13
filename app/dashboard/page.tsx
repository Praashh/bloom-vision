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
  Sparkle,
  Eye,
  Calendar
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

export default function Dashboard() {
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-x-hidden">
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 min-h-screen">
        {/* Navigation/Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100 transition-colors text-zinc-400">
                <CaretLeft size={20} weight="bold" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black-600 rounded-xl flex items-center justify-center shadow-lg shadow-black-200">
                <PhosphorInfinity size={24} color="white" weight="duotone" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                Dashboard
                <Badge variant="secondary" className="ml-2 bg-black-50 text-black-600 border-black-100 px-2 py-0 text-[10px] uppercase tracking-wider font-bold">
                  Pro
                </Badge>
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-zinc-50 border border-zinc-100 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
              {images.length} Generations
            </span>
          </div>
        </header>

        <Tabs defaultValue="grid" className="space-y-12">
          {/* Controls Bar - Simplified */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black-50 flex items-center justify-center">
                <ClockCounterClockwise size={20} className="text-black-600" weight="duotone" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Generation History</h3>
                <p className="text-sm text-zinc-500">Your visual asset library</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TabsList className="bg-zinc-50 border border-zinc-100 p-1 rounded-xl h-10">
                <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black-600 h-8 px-3">
                  <SquaresFour size={18} weight="duotone" />
                </TabsTrigger>
                <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black-600 h-8 px-3">
                  <PhosphorList size={18} weight="duotone" />
                </TabsTrigger>
              </TabsList>
              <Link href="/">
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl h-10 px-5 font-semibold text-sm shadow-md gap-2">
                  <Sparkle size={18} weight="duotone" />
                  New Asset
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-3xl bg-zinc-100" />
                  <div className="space-y-2 px-1">
                    <Skeleton className="h-4 w-3/4 bg-zinc-100" />
                    <Skeleton className="h-3 w-1/2 bg-zinc-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-32 flex flex-col items-center justify-center text-zinc-400 gap-6 border border-zinc-100 rounded-[3rem] bg-zinc-50/50 shadow-inner"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-zinc-100 shadow-sm text-zinc-200">
                <PhosphorImage size={32} weight="duotone" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-bold text-zinc-900">Your gallery is empty</p>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">Start creating unique brand visuals using our AI-powered generation engine.</p>
              </div>
              <Link href="/">
                <Button className="mt-4 px-8 h-12 bg-black-600 text-white font-bold rounded-2xl hover:bg-black-700 transition-all active:scale-95 shadow-lg shadow-black-100 gap-2">
                  <Sparkle size={20} weight="duotone" />
                  Create First Asset
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                  <AnimatePresence mode="popLayout">
                    {images.map((img, idx) => (
                      <motion.div
                        key={img.url}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.03, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        layout
                      >
                        <Card
                          className="group relative bg-white border-zinc-100 rounded-[2.5rem] overflow-hidden hover:border-black-100 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black-500/5 cursor-pointer"
                          onClick={() => setSelectedImage({ url: img.url, name: img.name })}
                        >
                          <CardContent className="p-3">
                            <div className="aspect-square w-full relative bg-zinc-50 rounded-[2rem] overflow-hidden border border-zinc-100">
                              <Image
                                src={img.url}
                                alt={img.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                              />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                                <div className="flex justify-end">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-10 h-10 rounded-xl bg-white/80 hover:bg-white text-zinc-900 shadow-sm border border-zinc-100"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <DotsThreeVertical size={20} weight="bold" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-100 text-zinc-700 rounded-xl shadow-xl p-1">
                                      <DropdownMenuItem
                                        className="focus:bg-black-50 focus:text-black-600 rounded-lg py-2 gap-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedImage({ url: img.url, name: img.name });
                                        }}
                                      >
                                        <Eye size={18} weight="duotone" />
                                        Quick View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="focus:bg-black-50 focus:text-black-600 rounded-lg py-2 gap-2" onClick={(e) => e.stopPropagation()}>
                                        <PhosphorImage size={18} weight="duotone" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600 rounded-lg font-medium py-2 gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Trash size={18} weight="duotone" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <a
                                      href={img.url}
                                      download
                                      className="flex-1 mr-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl font-bold h-11 shadow-lg gap-2">
                                        <DownloadSimple size={18} weight="bold" />
                                        Save PNG
                                      </Button>
                                    </a>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-11 h-11 rounded-xl bg-white/80 hover:bg-white text-zinc-900 shadow-sm border border-zinc-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage({ url: img.url, name: img.name });
                                      }}
                                    >
                                      <Eye size={20} weight="duotone" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 px-3 pb-2 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-zinc-900 truncate max-w-[120px]">{img.name.split('.')[0]}</h4>
                                <Badge variant="outline" className="text-[9px] bg-zinc-50 border-zinc-100 text-zinc-400 h-5 px-1.5 rounded-md font-bold uppercase tracking-tighter">PNG</Badge>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <Sparkle size={12} className="text-black-400" weight="duotone" />
                                  Bloom Vision
                                </span>
                                <span>2m ago</span>
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
                <Card className="border-zinc-100 shadow-sm rounded-3xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-zinc-50/50">
                      <TableRow className="hover:bg-transparent border-zinc-100">
                        <TableHead className="w-[100px] font-bold text-zinc-500">Preview</TableHead>
                        <TableHead className="font-bold text-zinc-500">Asset Name</TableHead>
                        <TableHead className="font-bold text-zinc-500">Status</TableHead>
                        <TableHead className="font-bold text-zinc-500">Date Generated</TableHead>
                        <TableHead className="text-right font-bold text-zinc-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {images.map((img) => (
                        <TableRow key={img.url} className="hover:bg-zinc-50/50 transition-colors border-zinc-100">
                          <TableCell>
                            <div
                              className="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-100 bg-zinc-50 relative cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setSelectedImage({ url: img.url, name: img.name })}
                            >
                              <Image
                                src={img.url}
                                alt={img.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="text-zinc-900 font-bold">{img.name.split('.')[0]}</span>
                              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Portable Network Graphics</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[10px] h-6">
                              Ready
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-500 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={18} className="text-zinc-300" weight="duotone" />
                              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild className="rounded-xl h-9 w-9 text-zinc-400 hover:text-black-600 hover:bg-black-50">
                                <a href={img.url} download>
                                  <DownloadSimple size={18} weight="bold" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl h-9 w-9 text-zinc-400 hover:text-black-600 hover:bg-black-50"
                                onClick={() => setSelectedImage({ url: img.url, name: img.name })}
                              >
                                <Eye size={18} weight="duotone" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-zinc-400">
                                    <DotsThreeVertical size={18} weight="bold" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-100 text-zinc-700 rounded-xl shadow-xl">
                                  <DropdownMenuItem className="focus:bg-red-50 focus:text-red-500 rounded-lg py-2 gap-2 font-medium">
                                    <Trash size={18} weight="duotone" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
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
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none rounded-[2rem] shadow-2xl">
            <DialogHeader className="p-6 pb-0 absolute top-0 left-0 right-0 z-50 bg-linear-to-b from-white to-transparent pointer-events-none">
              <DialogTitle className="text-xl font-bold text-zinc-900 pointer-events-auto flex items-center justify-between">
                <span>{selectedImage?.name.split('.')[0]}</span>
                {selectedImage && (
                  <a href={selectedImage.url} download className="pointer-events-auto">
                    <Button size="sm" className="bg-black-600 hover:bg-black-700 h-9 rounded-xl px-4 font-bold gap-2">
                      <DownloadSimple size={18} weight="bold" />
                      Download
                    </Button>
                  </a>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-square w-full relative bg-zinc-50">
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
      <footer className="mt-32 py-16 border-t border-zinc-100 text-center bg-zinc-50/30">
        <p className="text-zinc-500 text-sm font-medium">
          Built with <span className="text-black-600 font-bold italic">Bloom</span> by <Link href={"https://x.com/10xpraash"} target="_blank" className="text-zinc-900 hover:text-black-600 transition-colors font-bold">Praash</Link>
        </p>
      </footer>
    </div>
  );
}
