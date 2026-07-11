"use client";

import { useState } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Philosophy", "Business", "Fiction", "History", "Science"];

  const books = [
    { id: 1, title: "The Psychology of Money", author: "Morgan Housel", category: "Business", color: "from-indigo-600 to-indigo-900" },
    { id: 2, title: "Meditations", author: "Marcus Aurelius", category: "Philosophy", color: "from-amber-600 to-amber-900" },
    { id: 3, title: "Atomic Habits", author: "James Clear", category: "Business", color: "from-teal-600 to-teal-900" },
    { id: 4, title: "Dune", author: "Frank Herbert", category: "Fiction", color: "from-orange-600 to-orange-900" },
    { id: 5, title: "Sapiens", author: "Yuval Noah Harari", category: "History", color: "from-rose-600 to-rose-900" },
    { id: 6, title: "Project Hail Mary", author: "Andy Weir", category: "Science", color: "from-blue-600 to-blue-900" },
    { id: 7, title: "Deep Work", author: "Cal Newport", category: "Business", color: "from-cyan-600 to-cyan-900" },
    { id: 8, title: "The Republic", author: "Plato", category: "Philosophy", color: "from-purple-600 to-purple-900" },
  ];

  const filteredBooks = books.filter(b => {
    const matchesTab = activeTab === "All" || b.category === activeTab;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Library Catalog</h1>
          <p className="text-slate-400">Discover your next favorite book.</p>
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.map((book, i) => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative flex flex-col"
          >
            {/* Cover Image Container */}
            <div className={`relative aspect-[2/3] w-full rounded-2xl bg-gradient-to-br ${book.color} shadow-lg overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10`}>
              {/* CSS Book Binding effect */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/40 to-transparent border-r border-white/5" />
              
              {/* Title printed on cover */}
              <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center opacity-80">
                <h3 className="text-white font-serif font-bold text-lg leading-tight mb-2 drop-shadow-md">{book.title}</h3>
                <p className="text-white/80 text-xs font-medium uppercase tracking-widest drop-shadow-md">{book.author}</p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link href={`/reader/${book.id}`} className="px-5 py-2.5 bg-white text-slate-950 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                  Read
                </Link>
              </div>
            </div>

            {/* Metadata below cover */}
            <div className="mt-3 px-1">
              <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-indigo-400 transition-colors">{book.title}</h3>
              <p className="text-sm text-slate-400">{book.author}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
