"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, MessageSquare, Layers, Users, Quote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, [supabase]);

  return (
    <div className="flex flex-col w-full bg-white text-charcoal selection:bg-terracotta/20">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] p-8 text-center overflow-hidden bg-grid-slate-50/[0.05]">
        <div className="absolute inset-0 bg-white [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-5xl space-y-10 mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto w-fit flex items-center gap-2 px-5 py-2 rounded-full bg-offwhite border border-slate-300 text-slate-600 text-sm font-semibold tracking-wide shadow-subtle"
          >
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>Elevate your reading experience</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-charcoal leading-[1.05]"
          >
            Read Between the <br className="hidden md:block" />
            <span className="text-terracotta">
              Living Margins.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light"
          >
            A pristine, distraction-free environment to annotate thoughts, share insights, and build a personalized knowledge graph over the written word.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10"
          >
            <Link href="/login" className="group relative px-8 py-4 rounded-lg bg-charcoal text-white font-semibold flex items-center justify-center gap-3 transition-all hover:bg-slate-800 hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto shadow-xl shadow-slate-200/50">
              <BookOpen className="w-5 h-5" />
              Start Reading for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={isAuthenticated ? "/catalog" : "/login"} className="px-8 py-4 rounded-lg bg-offwhite text-charcoal font-semibold flex items-center justify-center gap-2 transition-all hover:bg-slate-100 w-full sm:w-auto border border-slate-300">
              Explore the Catalog
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="relative z-10 py-20 md:py-32 px-8 bg-offwhite border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-charcoal">More than just text on a screen.</h2>
            <p className="text-xl text-slate-500 font-light">The Living Margin transforms solitary reading into a dynamic, deeply personalized experience designed for modern thinkers.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="p-10 rounded-2xl bg-slate-100 border border-slate-300 space-y-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-charcoal">Dynamic Annotations</h3>
              <p className="text-slate-500 leading-relaxed font-light">Highlight text and leave rich margin notes. Your thoughts are permanently anchored to the exact sentence, creating a personal knowledge graph.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="p-10 rounded-2xl bg-slate-100 border border-slate-300 space-y-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-charcoal">Social Reading</h3>
              <p className="text-slate-500 leading-relaxed font-light">Follow friends and thought leaders to see their public highlights. Discuss difficult passages directly in the margins with other readers.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="p-10 rounded-2xl bg-slate-100 border border-slate-300 space-y-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
                <Layers className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-charcoal">Smart Bookshelf</h3>
              <p className="text-slate-500 leading-relaxed font-light">Organize your entire digital library. Track your reading progress, categorize by custom tags, and instantly search through all your past annotations.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. CTA FOOTER */}
      <footer className="py-20 md:py-32 px-8 bg-white border-t border-slate-200 text-center relative">
        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-charcoal">Ready to upgrade your library?</h2>
          <p className="text-xl text-slate-500 pb-4 font-light">Join The Living Margin today and bring your books to life.</p>
          <Link href="/login" className="w-fit px-10 py-5 rounded-lg bg-terracotta hover:bg-[#d46a4f] text-white font-bold text-lg flex items-center justify-center gap-3 mx-auto transition-all shadow-xl shadow-terracotta/20 hover:-translate-y-1">
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="mt-32 pt-10 border-t border-slate-200 text-slate-400 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto text-sm font-medium">
          <p>© 2026 The Living Margin. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-charcoal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-charcoal transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-charcoal transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
