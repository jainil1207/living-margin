"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Bookmark, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CommunityFeedPage() {
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPublicAnnotations = async () => {
      // Fetch annotations that are public
      const { data: publicNotes, error: notesError } = await supabase
        .from("annotations")
        .select("*, books(title, cover_url), profiles(full_name, avatar_url)")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (notesError) {
        // We silently catch this because we have a manual join fallback below!
      }
      
      // Some DB schemas might not have foreign keys setup perfectly for the above select,
      // so if it fails or returns nothing, let's do manual joining as a fallback just in case.
      if (publicNotes && publicNotes.length > 0 && publicNotes[0].books) {
        setAnnotations(publicNotes);
      } else {
         const { data: rawNotes } = await supabase.from("annotations").select("*").eq("is_public", true).order("created_at", { ascending: false });
         if (rawNotes) {
            // Fetch all books
            const { data: books } = await supabase.from("books").select("id, title, cover_url");
            const bookMap = new Map(books?.map(b => [b.id, b]) || []);
            
            // Fetch all profiles
            const userIds = Array.from(new Set(rawNotes.map(n => n.user_id)));
            let profileMap = new Map();
            if (userIds.length > 0) {
              const { data: profiles } = await supabase.from("profiles").select("*").in("id", userIds);
              profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
            }

            const enriched = rawNotes.map(n => ({
              ...n,
              books: bookMap.get(n.book_id),
              profiles: profileMap.get(n.user_id)
            }));
            setAnnotations(enriched);
         }
      }
      setIsLoading(false);
    };

    fetchPublicAnnotations();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Community Margins</h1>
        <p className="text-slate-400">Discover thoughts and highlights shared by other readers.</p>
      </div>

      {annotations.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-slate-800 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No public notes yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Be the first to share your thoughts! Go to any book in the library, add a margin note, and check "Make Public".
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {annotations.map((note, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={note.id}
              className="break-inside-avoid bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group"
            >
              <div className="p-5">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  {note.profiles?.avatar_url ? (
                    <img src={note.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover bg-slate-800" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      {(note.profiles?.full_name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{note.profiles?.full_name || "Unknown Reader"}</div>
                    <div className="text-xs text-slate-500">{new Date(note.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Highlight */}
                {note.highlight_text && note.highlight_text !== "General Note" && (
                  <div className="relative mb-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-sm font-serif italic text-slate-300 leading-relaxed">
                      "{note.highlight_text}"
                    </p>
                  </div>
                )}

                {/* Note */}
                <p className="text-slate-200 text-sm leading-relaxed mb-6">
                  {note.note_text}
                </p>

                {/* Book Link */}
                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-8 bg-slate-800 rounded overflow-hidden relative">
                       {note.books?.cover_url && (
                         <img src={note.books.cover_url} alt="" className="object-cover w-full h-full" />
                       )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]">
                      {note.books?.title || "Unknown Book"}
                    </span>
                  </div>
                  <Link 
                    href={`/reader/${note.book_id}`}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded"
                  >
                    Open Book
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
