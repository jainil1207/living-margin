"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, MessageSquare, Share2, MoreVertical, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const fallbackColors = [
  "from-indigo-600/20 to-indigo-900/5",
  "from-amber-600/20 to-amber-900/5",
  "from-teal-600/20 to-teal-900/5",
  "from-rose-600/20 to-rose-900/5",
  "from-cyan-600/20 to-cyan-900/5",
  "from-purple-600/20 to-purple-900/5",
];

export default function AnnotationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchAnnotations = async () => {
      // Get the logged in user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Fetch user's annotations joined with book data
      const { data } = await supabase
        .from('annotations')
        .select(`
          *,
          books (
            title,
            author,
            cover_url
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setAnnotations(data);
      }
      setIsLoading(false);
    };

    fetchAnnotations();
  }, []);

  const filters = ["All", "Recent", "Favorites"];

  const filteredAnnotations = annotations.filter(a => {
    // Filter by Tab
    let matchesTab = true;
    if (activeTab === "Favorites") matchesTab = a.is_favorite;
    
    // Filter by Search
    const matchesSearch = 
      a.highlight_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.note_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.books?.title.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Your Annotations</h1>
          <p className="text-slate-400">You have {annotations.length} highlights and notes across your library.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search highlights or your notes..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-xl"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all backdrop-blur-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveTab(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === filter 
                ? "bg-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)]" 
                : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredAnnotations.map((annotation, i) => {
            const color = fallbackColors[annotation.books?.title?.length % fallbackColors.length || 0];
            return (
              <motion.div 
                key={annotation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                <div className={`p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/30 border border-slate-800 backdrop-blur-sm shadow-xl group hover:border-slate-600 transition-colors relative overflow-hidden`}>
                  
                  {/* Subtle top color accent based on book */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-50`} />

                  {/* Book Metadata */}
                  <div className="flex items-start justify-between mb-4">
                    <Link href={`/reader/${annotation.book_id}`} className="flex items-center gap-2 group/link">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center overflow-hidden group-hover/link:bg-indigo-500/20 transition-colors">
                        {annotation.books?.cover_url ? (
                          <img src={annotation.books.cover_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-slate-400 group-hover/link:text-indigo-400 transition-colors" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover/link:text-indigo-400 transition-colors">{annotation.books?.title}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{annotation.books?.author}</p>
                      </div>
                    </Link>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Highlight (Serif Font) */}
                  {annotation.highlight_text !== "General Note" && (
                    <div className="relative mb-5">
                      <div className="absolute -left-2 -top-2 text-4xl text-slate-700 opacity-30 font-serif">"</div>
                      <p className="text-slate-300 font-serif leading-relaxed text-base italic relative z-10">
                        {annotation.highlight_text}
                      </p>
                    </div>
                  )}

                  {/* Note (Sans-serif Font) */}
                  {annotation.note_text && (
                    <div className="bg-slate-950/50 rounded-xl p-4 mb-4 border border-slate-800/50">
                      <p className="text-sm text-slate-200">
                        <span className="text-indigo-400 font-bold mr-2">Note:</span>
                        {annotation.note_text}
                      </p>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-4">
                      <button className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1.5 text-xs">
                        <Heart className={`w-4 h-4 ${annotation.is_favorite ? "fill-rose-500 text-rose-500" : ""}`} />
                      </button>
                      <button className="text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-xs">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-xs">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(annotation.created_at).toLocaleDateString()}</span>
                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      
      {!isLoading && filteredAnnotations.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No annotations found</h3>
          <p className="text-slate-400 max-w-sm mx-auto">We couldn't find any highlights or notes. Try going to the catalog, opening a book, and saving a note!</p>
          <Link href="/catalog" className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 transition-colors">
            Go to Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
