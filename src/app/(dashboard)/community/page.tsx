"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { BookOpen, User, MessageSquareQuote, Clock } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPublicNotes = async () => {
      // 1. Fetch public annotations
      const { data: annotationsData, error: annError } = await supabase
        .from("annotations")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (annError || !annotationsData || annotationsData.length === 0) {
        if (annError) console.error("Annotations fetch error:", annError);
        setAnnotations([]);
        setIsLoading(false);
        return;
      }

      // 2. Fetch profiles
      const userIds = Array.from(new Set(annotationsData.map((a: any) => a.user_id)));
      const { data: profilesData } = await supabase.from("profiles").select("*").in("id", userIds);
      const profileMap: Record<string, any> = {};
      profilesData?.forEach((p: any) => profileMap[p.id] = p);

      // 3. Fetch books
      const bookIds = Array.from(new Set(annotationsData.map((a: any) => a.book_id)));
      const { data: booksData } = await supabase.from("books").select("*").in("id", bookIds);
      const bookMap: Record<string, any> = {};
      booksData?.forEach((b: any) => bookMap[b.id] = b);

      // 4. Enrich annotations
      const enrichedAnnotations = annotationsData.map((a: any) => ({
        ...a,
        profiles: profileMap[a.user_id] || null,
        books: bookMap[a.book_id] || null
      }));

      setAnnotations(enrichedAnnotations);
      setIsLoading(false);
    };

    fetchPublicNotes();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 md:p-12 animate-pulse flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="h-10 w-48 bg-slate-800 rounded-lg"></div>
        <div className="h-6 w-96 bg-slate-800/50 rounded-lg mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 w-full bg-slate-800/50 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 max-w-5xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Community Feed</h1>
        <p className="text-slate-400">Discover insights and public notes from readers across the platform.</p>
      </div>

      {annotations.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <MessageSquareQuote className="w-12 h-12 text-slate-700 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No public notes yet</h3>
          <p className="text-slate-400 mb-6 max-w-sm">Be the first to share an insight! Go to the catalog, open a book, and make your note public.</p>
          <Link href="/catalog" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium">
            Explore the Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {annotations.map((note, idx) => {
            const authorName = note.profiles?.full_name || "Anonymous Reader";
            const avatarUrl = note.profiles?.avatar_url;
            const bookTitle = note.books?.title || "Unknown Book";
            const bookAuthor = note.books?.author || "Unknown Author";
            
            // Format date relative to now or absolute
            const date = new Date(note.created_at);
            const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={note.id} 
                className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Left Column: User & Book Info */}
                  <div className="flex-shrink-0 md:w-64 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-slate-800/50 pb-6 md:pb-0 md:pr-8">
                    {/* User */}
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                          <img src={avatarUrl} alt={authorName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-700">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-200 text-sm">{authorName}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {dateString}
                        </div>
                      </div>
                    </div>
                    
                    {/* Book */}
                    <Link href={`/reader/${note.book_id}`} className="block group/book">
                      <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50 flex gap-3 transition-colors group-hover/book:bg-slate-900/80 group-hover/book:border-indigo-500/30">
                        {note.books?.cover_url ? (
                          <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 shadow-lg">
                            <img src={note.books.cover_url} alt={bookTitle} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-16 rounded bg-slate-800 flex items-center justify-center text-slate-600 flex-shrink-0 shadow-lg">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex flex-col justify-center overflow-hidden">
                          <div className="text-xs font-semibold text-indigo-300/80 mb-0.5">Reading</div>
                          <div className="text-sm font-medium text-slate-300 truncate group-hover/book:text-indigo-200 transition-colors">{bookTitle}</div>
                          <div className="text-xs text-slate-500 truncate">{bookAuthor}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Right Column: Note Content */}
                  <div className="flex-1 flex flex-col justify-center relative">
                    <MessageSquareQuote className="absolute -top-2 -left-2 w-16 h-16 text-slate-800/30 -z-10" />
                    
                    {note.highlight_text && note.highlight_text !== "General Note" && (
                      <div className="mb-4 pl-4 border-l-2 border-indigo-500/30">
                        <p className="text-sm text-slate-400 italic">
                          "{note.highlight_text}"
                        </p>
                      </div>
                    )}
                    
                    <p className="text-slate-200 text-lg leading-relaxed">
                      {note.note_text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
