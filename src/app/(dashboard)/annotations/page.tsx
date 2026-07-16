"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, MessageSquare, Share2, MoreVertical, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const fallbackColors = [
  "from-slate-100 to-slate-200",
  "from-orange-50 to-orange-100",
  "from-amber-50 to-amber-100",
  "from-yellow-50 to-yellow-100",
  "from-lime-50 to-lime-100",
  "from-emerald-50 to-emerald-100",
  "from-teal-50 to-teal-100",
  "from-cyan-50 to-cyan-100",
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
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-2 tracking-tight">Your Annotations</h1>
          <p className="text-slate-500 font-medium">You have {annotations.length} highlights and notes across your library.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-charcoal transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search highlights or your notes..." 
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all shadow-sm font-medium"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-charcoal hover:bg-slate-50 transition-all shadow-sm">
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
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === filter 
                ? "bg-charcoal text-white shadow-md scale-105" 
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-charcoal"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal border-t-transparent"></div>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredAnnotations.map((annotation, i) => {
            const color = fallbackColors[annotation.books?.title?.length % fallbackColors.length || 0];
            return (
              <motion.div 
                key={annotation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="break-inside-avoid"
              >
                <div className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-sm group hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden`}>
                  
                  {/* Subtle top color accent based on book */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-80`} />

                  {/* Book Metadata */}
                  <div className="flex items-start justify-between mb-5 mt-1">
                    <Link href={`/reader/${annotation.book_id}`} className="flex items-center gap-3 group/link">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden group-hover/link:border-terracotta transition-colors shadow-sm">
                        {annotation.books?.cover_url ? (
                          <img src={annotation.books.cover_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-slate-300 group-hover/link:text-terracotta transition-colors" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-charcoal group-hover/link:text-terracotta transition-colors">{annotation.books?.title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{annotation.books?.author}</p>
                      </div>
                    </Link>
                    <button className="text-slate-400 hover:text-charcoal transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Highlight (Serif Font) */}
                  {annotation.highlight_text !== "General Note" && (
                    <div className="relative mb-5 mt-2">
                      <div className="absolute -left-2 -top-2 text-4xl text-slate-200 opacity-60 font-serif leading-none">"</div>
                      <p className="text-slate-600 font-serif leading-relaxed text-base italic relative z-10 pl-2">
                        {annotation.highlight_text}
                      </p>
                    </div>
                  )}

                  {/* Note (Sans-serif Font) */}
                  {annotation.note_text && (
                    <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 shadow-inner">
                      <p className="text-sm text-charcoal">
                        <span className="text-terracotta font-bold mr-2">Note:</span>
                        {annotation.note_text}
                      </p>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-xs">
                        <Heart className={`w-4 h-4 ${annotation.is_favorite ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                      <button className="text-slate-400 hover:text-charcoal transition-colors flex items-center gap-1.5 text-xs">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-charcoal transition-colors flex items-center gap-1.5 text-xs">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(annotation.created_at).toLocaleDateString()}</span>
                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      
      {!isLoading && filteredAnnotations.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-xl font-heading font-bold text-charcoal mb-2">No annotations found</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">We couldn't find any highlights or notes. Try going to the catalog, opening a book, and saving a note!</p>
          <Link href="/catalog" className="mt-6 px-6 py-2.5 bg-charcoal text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-md">
            Go to Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
