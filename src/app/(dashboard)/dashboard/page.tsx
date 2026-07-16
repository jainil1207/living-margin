"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, BookText, TrendingUp, Clock, Flame, PenTool, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function DashboardPage() {
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [recentHighlights, setRecentHighlights] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("Reader");
  const [statsData, setStatsData] = useState({ totalBooks: 0, totalAnnotations: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get profile name
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", session.user.id).single();
      if (profile?.full_name) {
        setFirstName(profile.full_name.split(" ")[0]);
      }

      // Fetch a few books
      const { data: books } = await supabase.from("books").select("*").order('created_at', { ascending: false });
      if (books) {
        const uniqueBooks = books.filter((book, index, self) => 
          index === self.findIndex((b) => b.title === book.title)
        ).slice(0, 2);
        setRecentBooks(uniqueBooks);
      }

      // Fetch user's recent highlights
      const { data: notes } = await supabase
        .from("annotations")
        .select("*, books(title)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);
        
      if (notes) {
        setRecentHighlights(notes);
        // Also get total count
        const { count } = await supabase.from("annotations").select("*", { count: 'exact', head: true }).eq("user_id", session.user.id);
        setStatsData({
          totalBooks: books ? books.length : 0, 
          totalAnnotations: count || 0
        });
      }
      
      setIsLoading(false);
    };

    fetchDashboardData();
  }, [supabase]);

  const stats = [
    { label: "Books in Library", value: statsData.totalBooks.toString(), icon: BookText, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
    { label: "Total Annotations", value: statsData.totalAnnotations.toString(), icon: PenTool, color: "text-terracotta", bg: "bg-terracotta/10", border: "border-terracotta/20" },
    { label: "Reading Streak", value: "1 Day", icon: Flame, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Hours Read", value: "2h", icon: Clock, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-2 md:p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-2 tracking-tight">Good evening, {firstName}</h1>
          <p className="text-slate-500 font-medium">Here is what is happening in your library today.</p>
        </div>
        <Link href="/catalog" className="flex items-center justify-center gap-2 px-6 py-3 bg-charcoal hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-subtle hover:shadow-lg w-full md:w-auto">
          <BookOpen className="w-4 h-4" />
          Continue Reading
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-charcoal mt-0.5">{stat.value}</p>
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
            <h2 className="text-xl font-heading font-bold text-charcoal flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-terracotta" />
              Recently Added Books
            </h2>
            <Link href="/catalog" className="text-sm font-semibold text-terracotta hover:text-[#c4654d] flex items-center gap-1 group">
              View all
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
               <div className="text-slate-500 p-4 font-medium">Loading books...</div>
            ) : recentBooks.length === 0 ? (
               <div className="text-slate-500 p-4 bg-white border border-slate-200 rounded-2xl font-medium text-center">
                 No books in library yet.
               </div>
            ) : recentBooks.map((book) => (
              <Link href={`/reader/${book.id}`} key={book.id} className="group bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                <div className="w-20 h-28 bg-slate-100 border border-slate-200 rounded-lg flex-shrink-0 shadow-sm overflow-hidden">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen className="w-6 h-6" /></div>
                  )}
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="font-bold text-charcoal group-hover:text-terracotta transition-colors line-clamp-1">{book.title}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-4">{book.author}</p>
                  
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-1.5 overflow-hidden border border-slate-200">
                    <div className="bg-terracotta h-full rounded-full w-[0%]" />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">0% Complete</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Activity (Takes up 1/3) */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-charcoal">Recent Highlights</h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              {isLoading ? (
                 <p className="text-sm font-medium text-slate-500">Loading highlights...</p>
              ) : recentHighlights.length === 0 ? (
                 <p className="text-sm font-medium text-slate-500 text-center py-4">No highlights yet. Start reading to add some!</p>
              ) : recentHighlights.map((note) => (
                <div key={note.id} className="relative pl-4 border-l-2 border-slate-200 hover:border-terracotta transition-colors">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-terracotta" />
                  <p className="text-sm font-medium text-slate-600 italic mb-2 line-clamp-2">
                    &quot;{note.highlight_text || note.note_text}&quot;
                  </p>
                  <p className="text-xs text-slate-400 font-semibold truncate">— {note.books?.title || "Unknown Book"}</p>
                </div>
              ))}
            </div>
            <Link href="/annotations" className="block text-center w-full mt-8 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-charcoal transition-colors">
              View all highlights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
