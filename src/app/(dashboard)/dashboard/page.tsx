"use client";

import { motion } from "framer-motion";
import { BookOpen, BookText, TrendingUp, Clock, Flame } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Books Read", value: "12", icon: BookText, color: "text-indigo-400", bg: "bg-indigo-500/20", border: "border-indigo-500/30" },
    { label: "Total Annotations", value: "348", icon: PenToolPlaceholder, color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/30" },
    { label: "Reading Streak", value: "5 Days", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" },
    { label: "Hours Read", value: "42h", icon: Clock, color: "text-teal-400", bg: "bg-teal-500/20", border: "border-teal-500/30" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Good evening, Jainil</h1>
          <p className="text-slate-400">Here is what is happening in your library today.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)]">
          <BookOpen className="w-4 h-4" />
          Continue Reading
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Books (Takes up 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Recently Opened
            </h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View all</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:bg-slate-800/50 transition-colors cursor-pointer overflow-hidden">
                <div className="w-20 h-28 bg-slate-800 rounded-lg flex-shrink-0 shadow-lg" />
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">The Psychology of Money</h3>
                  <p className="text-sm text-slate-400 mb-3">Morgan Housel</p>
                  
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                    <div className="bg-indigo-500 h-1.5 rounded-full w-[45%]" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">45% Complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Activity (Takes up 1/3) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Recent Highlights</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-800">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-rose-500" />
                  <p className="text-sm text-slate-300 italic mb-2 line-clamp-2">
                    "True wealth is what you don't see. It's the cars not purchased, the diamonds not bought..."
                  </p>
                  <p className="text-xs text-slate-500 font-medium">— Chapter 4</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              View all highlights
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple fallback icon to avoid import issues
function PenToolPlaceholder(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
      <path d="M2 2l7.586 7.586"></path>
      <circle cx="11" cy="11" r="2"></circle>
    </svg>
  );
}
