"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Search, MessageSquare, ChevronRight, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReaderPage({ params }: { params: { id: string } }) {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-300 font-serif selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0F1C]/90 backdrop-blur-md border-b border-white/5 font-sans">
        <Link href="/catalog" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-white transition-colors p-2"><Search className="w-5 h-5" /></button>
          <button className="hover:text-white transition-colors p-2"><Bookmark className="w-5 h-5" /></button>
          <button className="hover:text-white transition-colors p-2"><Settings className="w-5 h-5" /></button>
        </div>
      </header>

      {/* Main Layout: Reader + Margin */}
      <div className="flex max-w-[1400px] mx-auto">
        
        {/* Left Spacer (for balance) */}
        <div className="hidden lg:block flex-1 max-w-[200px]" />

        {/* Center: The Text */}
        <main className="flex-[2] max-w-[700px] px-8 py-16 lg:px-12 leading-relaxed text-lg lg:text-xl text-slate-300">
          <div className="mb-16 text-center font-sans">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-serif">Meditations</h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest">Marcus Aurelius</p>
          </div>

          <p className="mb-8">
            Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly...
          </p>

          <p className="mb-8">
            <span 
              onClick={() => setActiveHighlight("h1")}
              className={`cursor-pointer transition-colors duration-300 rounded px-1 ${
                activeHighlight === "h1" ? "bg-indigo-600/60 text-white" : "bg-indigo-900/60 hover:bg-indigo-800/60 text-indigo-200"
              }`}
            >
              Every moment think steadily as a Roman and a man to do what thou hast in hand with perfect and simple dignity, and feeling of affection, and freedom, and justice;
            </span> 
            {" "}and to give thyself relief from all other thoughts. And thou wilt give thyself relief, if thou doest every act of thy life as if it were the last.
          </p>

          <p className="mb-8">
            Thou seest how few the things are, the which if a man lays hold of, he is able to live a life which flows in quiet, and is like the existence of the gods; for the gods on their part will require nothing more from him who observes these things.
          </p>

          <p className="mb-8">
            <span 
              onClick={() => setActiveHighlight("h2")}
              className={`cursor-pointer transition-colors duration-300 rounded px-1 ${
                activeHighlight === "h2" ? "bg-rose-600/60 text-white" : "bg-rose-900/60 hover:bg-rose-800/60 text-rose-200"
              }`}
            >
              Do wrong to thyself, do wrong to thyself, my soul; but thou wilt no longer have the opportunity of honoring thyself. Every man&apos;s life is sufficient.
            </span> 
            {" "}But thine is nearly finished, though thy soul reverences not itself, but places thy felicity in the souls of others.
          </p>

          <p className="mb-8">
            Do the things external which fall upon thee distract thee? Give thyself time to learn something new and good, and cease to be whirled around. But then thou must take care to avoid another error. For they are idlers even in action who have no aim in life to which they can direct every movement and, finally, every thought.
          </p>
        </main>

        {/* Right: The Living Margin */}
        <aside className="hidden md:block flex-[1.5] max-w-[400px] border-l border-white/5 bg-[#0A0F1C] relative">
          <div className="sticky top-16 h-[calc(100vh-64px)] p-6 overflow-y-auto font-sans">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
              The Living Margin
            </div>

            <AnimatePresence mode="wait">
              {activeHighlight === "h1" && (
                <motion.div
                  key="note1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-indigo-950/30 border border-indigo-500/20 p-5 rounded-2xl mb-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                      <span className="text-xs text-slate-400">Jainil Trivedi</span>
                    </div>
                    <span className="text-xs text-slate-500">2 mins ago</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    This is a profound stoic realization. We must treat every action as if it were our final one to truly focus our mind and eliminate distractions.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <button className="flex items-center gap-1 hover:text-indigo-400 transition-colors"><MessageSquare className="w-3 h-3"/> Reply</button>
                  </div>
                </motion.div>
              )}

              {activeHighlight === "h2" && (
                <motion.div
                  key="note2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-rose-950/30 border border-rose-500/20 p-5 rounded-2xl mb-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                      <span className="text-xs text-slate-400">Jainil Trivedi</span>
                    </div>
                    <span className="text-xs text-slate-500">1 day ago</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    I need to remember this when I feel overwhelmed. The only mind I can control is my own.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <button className="flex items-center gap-1 hover:text-rose-400 transition-colors"><MessageSquare className="w-3 h-3"/> Reply</button>
                  </div>
                </motion.div>
              )}

              {activeHighlight === null && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center text-slate-500 pb-32"
                >
                  <p className="text-sm">Select highlighted text in the book to view annotations in the margin.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </aside>

      </div>
    </div>
  );
}
