"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="The Living Margin Logo" 
            width={36} 
            height={36} 
            className="rounded-md object-cover bg-slate-900 border border-slate-800"
          />
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">
            The Living Margin
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
          <Link href="/community" className="hover:text-white transition-colors">Community</Link>
          <div className="w-[1px] h-4 bg-slate-800"></div>
          <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/register" className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)]">
              Sign up
            </Link>
          </motion.div>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-4 text-sm font-medium text-slate-300">
              <Link href="/catalog" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Catalog</Link>
              <Link href="/community" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Community</Link>
              <div className="h-[1px] w-full bg-slate-800 my-2"></div>
              <Link href="/login" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Log in</Link>
              <Link href="/register" className="text-center px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)]" onClick={() => setIsOpen(false)}>
                Sign up
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
