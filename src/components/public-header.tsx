"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-slate-100/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="The Living Margin Logo" 
            width={40} 
            height={40} 
            className="rounded-lg object-cover shadow-sm border border-slate-200"
          />
          <span className="font-heading font-bold text-xl tracking-tight text-charcoal">
            The Living Margin
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/catalog" className="hover:text-terracotta transition-colors">Catalog</Link>
          <Link href="/community" className="hover:text-terracotta transition-colors">Community</Link>
          <div className="w-[1px] h-5 bg-slate-200"></div>
          <Link href="/login" className="font-semibold text-charcoal hover:text-terracotta transition-colors">Log in</Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/register" className="px-6 py-2.5 rounded-lg bg-charcoal text-white hover:bg-slate-800 transition-colors shadow-subtle font-semibold">
              Sign up
            </Link>
          </motion.div>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:text-charcoal focus:outline-none"
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
            className="md:hidden border-t border-slate-200 bg-slate-100 overflow-hidden shadow-subtle"
          >
            <nav className="flex flex-col p-6 gap-6 text-sm font-medium text-slate-600">
              <Link href="/catalog" className="hover:text-terracotta transition-colors" onClick={() => setIsOpen(false)}>Catalog</Link>
              <Link href="/community" className="hover:text-terracotta transition-colors" onClick={() => setIsOpen(false)}>Community</Link>
              <div className="h-[1px] w-full bg-slate-100"></div>
              <Link href="/login" className="hover:text-terracotta transition-colors font-semibold text-charcoal" onClick={() => setIsOpen(false)}>Log in</Link>
              <Link href="/register" className="text-center px-4 py-3 rounded-lg bg-charcoal text-white hover:bg-slate-800 transition-colors shadow-subtle font-semibold" onClick={() => setIsOpen(false)}>
                Sign up
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
