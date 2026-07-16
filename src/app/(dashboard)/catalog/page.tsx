"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
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
      if (session?.user?.user_metadata?.role === 'admin') {
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
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-2 tracking-tight">Library Catalog</h1>
          <div className="flex items-center gap-4">
            <p className="text-slate-500 font-medium">Discover your next favorite book.</p>
            {isAdmin && (
              <Link href="/admin" className="text-xs bg-terracotta text-white px-4 py-2 rounded-full font-bold shadow-sm hover:bg-[#c4654d] hover:shadow transition-all">
                + Add Book
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-charcoal transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..." 
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all shadow-sm font-medium"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-charcoal hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === category 
                ? "bg-charcoal text-white shadow-md scale-105" 
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-charcoal"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal border-t-transparent"></div>
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
                  className={`relative aspect-[2/3] w-full rounded-2xl shadow-sm overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-slate-200 ${book.cover_url ? 'bg-slate-100' : `bg-gradient-to-br ${color}`}`}
                  style={book.cover_url ? { backgroundImage: `url(${book.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {/* CSS Book Binding effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/10 to-transparent border-r border-black/5 z-10" />
                  
                  {/* Title printed on cover if no cover image */}
                  {!book.cover_url && (
                    <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center opacity-80 z-10">
                      <h3 className="text-slate-800 font-serif font-bold text-lg leading-tight mb-2 drop-shadow-sm">{book.title}</h3>
                      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest drop-shadow-sm">{book.author}</p>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <Link href={`/reader/${book.id}`} className="px-5 py-2.5 bg-charcoal text-white rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
                      <BookOpen className="w-4 h-4" />
                      Read
                    </Link>
                  </div>
                </div>

                {/* Metadata Below Book */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-charcoal leading-tight mb-1 truncate">{book.title}</h3>
                  <p className="text-xs font-semibold text-slate-500 truncate">{book.author}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      
      {!isLoading && filteredBooks.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
            <BookOpen className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-xl font-heading font-bold text-charcoal mb-2">No books found</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">We couldn't find any books matching your search. Try checking back later!</p>
        </div>
      )}
    </div>
  );
}
