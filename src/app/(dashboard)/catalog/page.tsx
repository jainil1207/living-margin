"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const fallbackColors = [
  "from-indigo-600 to-indigo-900",
  "from-amber-600 to-amber-900",
  "from-teal-600 to-teal-900",
  "from-orange-600 to-orange-900",
  "from-rose-600 to-rose-900",
  "from-blue-600 to-blue-900",
  "from-cyan-600 to-cyan-900",
  "from-purple-600 to-purple-900",
];

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchBooks = async () => {
      // Check admin status
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "trivedijainil88@gmail.com") {
        setIsAdmin(true);
      }

      setIsLoading(true);
      
      const { data, error } = await supabase.from("books").select("id, title, author, cover_url, created_at").order('created_at', { ascending: false });
      if (data) {
        const uniqueBooks = data.filter((book, index, self) => 
          index === self.findIndex((b) => b.title === book.title)
        );
        setBooks(uniqueBooks);
      }
      
      setIsLoading(false);
    };
    fetchBooks();
  }, [supabase]);

  const categories = ["All", "Philosophy", "Business", "Fiction", "History", "Science"];

  const filteredBooks = books.filter(b => {
    // We don't have categories in DB right now, so we just filter by All
    const matchesTab = activeTab === "All"; 
    const titleMatch = b.title ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const authorMatch = b.author ? b.author.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return matchesTab && (titleMatch || authorMatch);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Library Catalog</h1>
          <div className="flex items-center gap-4">
            <p className="text-slate-400">Discover your next favorite book.</p>
            {isAdmin && (
              <Link href="/admin" className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20 hover:bg-indigo-600/30 hover:border-indigo-500/40 transition-colors">
                + Add Book
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-xl"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all backdrop-blur-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide opacity-50 pointer-events-none">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === category 
                ? "bg-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)]" 
                : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book, i) => {
            const color = fallbackColors[(book.title?.length || 0) % fallbackColors.length];
            return (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative flex flex-col"
              >
                {/* Cover Image Container */}
                <div 
                  className={`relative aspect-[2/3] w-full rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10 ${book.cover_url ? 'bg-slate-900' : `bg-gradient-to-br ${color}`}`}
                  style={book.cover_url ? { backgroundImage: `url(${book.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {/* CSS Book Binding effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/60 to-transparent border-r border-white/10 z-10" />
                  
                  {/* Title printed on cover if no cover image */}
                  {!book.cover_url && (
                    <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center opacity-80 z-10">
                      <h3 className="text-white font-serif font-bold text-lg leading-tight mb-2 drop-shadow-md">{book.title}</h3>
                      <p className="text-white/80 text-xs font-medium uppercase tracking-widest drop-shadow-md">{book.author}</p>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <Link href={`/reader/${book.id}`} className="px-5 py-2.5 bg-white text-slate-950 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                      <BookOpen className="w-4 h-4" />
                      Read
                    </Link>
                  </div>
                </div>

                {/* Metadata Below Book */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-white leading-tight mb-1 truncate">{book.title}</h3>
                  <p className="text-xs text-slate-400 truncate">{book.author}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      
      {!isLoading && filteredBooks.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No books found</h3>
          <p className="text-slate-400 max-w-sm mx-auto">We couldn't find any books matching your search. Try checking back later!</p>
        </div>
      )}
    </div>
  );
}
