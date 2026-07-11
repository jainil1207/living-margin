"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, MessageSquare, Share2, Layers, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] p-8 text-center overflow-hidden">
        {/* Background ambient gradients */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" 
        />

        <div className="relative z-10 max-w-5xl space-y-8 mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto w-fit flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-indigo-500/30 text-indigo-300 text-sm font-medium backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>The next evolution of digital reading is here</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-[1.1]"
          >
            Read Between the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-cyan-400 to-teal-300">
              Living Margins.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Experience your library dynamically. Annotate thoughts, share insights, and connect over the written word in a beautifully immersive reading canvas.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <button className="group relative px-8 py-4 rounded-full bg-white text-slate-950 font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)]">
              <BookOpen className="w-5 h-5" />
              Start Reading for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full bg-slate-900/50 text-white font-semibold flex items-center gap-2 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 w-full sm:w-auto border border-slate-700 backdrop-blur-sm">
              Explore the Catalog
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES GRID SECTION */}
      <section className="relative z-10 py-32 px-8 bg-slate-950 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">More than just text on a screen.</h2>
            <p className="text-xl text-slate-400">The Living Margin transforms solitary reading into a dynamic, collaborative, and deeply personalized experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold">Dynamic Annotations</h3>
              <p className="text-slate-400 leading-relaxed">Highlight text and leave rich margin notes. Your thoughts are permanently anchored to the exact sentence, creating a personal knowledge graph.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold">Social Reading</h3>
              <p className="text-slate-400 leading-relaxed">Follow friends and thought leaders to see their public highlights. Discuss difficult passages directly in the margins with other readers.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                <Layers className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold">Smart Bookshelf</h3>
              <p className="text-slate-400 leading-relaxed">Organize your entire digital library. Track your reading progress, categorize by custom tags, and instantly search through all your past annotations.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF / STATS */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-12 text-center">Join thousands redefining how they read</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center w-full max-w-4xl">
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">50k+</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Readers</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">1.2M</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Margin Notes</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">10k+</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Books Cataloged</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">4.9/5</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA FOOTER */}
      <footer className="py-32 px-8 bg-slate-900 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl font-bold tracking-tight">Ready to upgrade your library?</h2>
          <p className="text-xl text-slate-400 pb-4">Join The Living Margin today and bring your books to life.</p>
          <button className="px-10 py-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg flex items-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]">
            Create Your Free Account
            <Zap className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-32 pt-8 border-t border-slate-800 text-slate-500 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
          <p>© 2026 The Living Margin. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
