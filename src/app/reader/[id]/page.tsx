"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Search, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [book, setBook] = useState<any>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [newHighlightText, setNewHighlightText] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
      }

      // Fetch book
      const { data: bookData, error: bookError } = await supabase.from("books").select("*").eq("id", id).single();
      if (bookError) {
        console.error("Book fetch error:", bookError);
        setErrorMsg(bookError.message);
      }
      if (bookData) {
        setBook(bookData);
      }
      
      // Fetch annotations
      const { data: annotationsData, error: annError } = await supabase.from("annotations").select("*").eq("book_id", id).order('created_at', { ascending: false });
      if (annError) {
         console.error("Annotations fetch error:", annError);
      }
      if (annotationsData) {
        const userIds = Array.from(new Set(annotationsData.map((a: any) => a.user_id)));
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase.from("profiles").select("*").in("id", userIds);
          const profileMap: Record<string, any> = {};
          profilesData?.forEach((p: any) => profileMap[p.id] = p);
          
          const enrichedAnnotations = annotationsData.map((a: any) => ({
            ...a,
            profile: profileMap[a.user_id]
          }));
          setAnnotations(enrichedAnnotations);
        } else {
          setAnnotations(annotationsData);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id, supabase]);

  const handleSaveNote = async () => {
    if (!newNoteText.trim()) return;
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to save annotations.");
      return;
    }

    const newAnnotation = {
      user_id: session.user.id,
      book_id: id,
      highlight_text: newHighlightText.trim() || "General Note",
      note_text: newNoteText.trim(),
      is_public: isPublic,
    };

    const { data, error } = await supabase.from("annotations").insert(newAnnotation).select().single();
    
    if (error) {
      alert("Failed to save note: " + error.message);
    } else if (data) {
      // Add profile info to the new annotation so it renders correctly immediately
      const enrichedNewAnnotation = {
        ...data,
        profile: currentUser ? {
          full_name: currentUser.user_metadata?.full_name || "Me",
          avatar_url: currentUser.user_metadata?.avatar_url
        } : null
      };
      setAnnotations([enrichedNewAnnotation, ...annotations]);
      setIsAddingNote(false);
      setNewNoteText("");
      setNewHighlightText("");
      setIsPublic(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center text-white">Loading book...</div>;
  }

  if (!book) {
    return <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center justify-center text-white gap-4">
      <p>Book not found.</p>
      {errorMsg && <p className="text-rose-400 max-w-lg text-center bg-rose-900/20 p-4 rounded-xl border border-rose-900/50">Error details: {errorMsg}</p>}
      <Link href="/catalog" className="text-indigo-400 hover:underline">Back to library</Link>
    </div>;
  }

  // Split book content into paragraphs
  const paragraphs = book.content.split('\n').filter((p: string) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-300 font-serif selection:bg-indigo-500/30">
       <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0F1C]/90 backdrop-blur-md border-b border-white/5 font-sans">
        <Link href="/catalog" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-white transition-colors p-2"><Search className="w-5 h-5" /></button>
          <button className="hover:text-white transition-colors p-2"><Bookmark className="w-5 h-5" /></button>
          <button className="hover:text-white transition-colors p-2"><Settings className="w-5 h-5" /></button>
        </div>
      </header>
      
      <div className="flex max-w-[1400px] mx-auto">
        <div className="hidden lg:block flex-1 max-w-[200px]" />
        
        <main className="flex-[2] max-w-[700px] px-8 py-16 lg:px-12 leading-relaxed text-lg lg:text-xl text-slate-300 relative">
          <div className="mb-16 text-center font-sans">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-serif">{book.title}</h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest">{book.author}</p>
          </div>

          <div 
            className="space-y-8" 
            onMouseUp={() => {
              const selection = window.getSelection();
              if (selection && selection.toString().length > 0) {
                 setNewHighlightText(selection.toString());
              }
            }}
          >
            {paragraphs.map((p: string, idx: number) => {
              // Simple highlighter logic: split the paragraph by each annotation's highlight text
              let elements: (string | React.ReactNode)[] = [p];

              annotations.forEach(note => {
                if (note.highlight_text && note.highlight_text !== "General Note") {
                  const newElements: (string | React.ReactNode)[] = [];
                  elements.forEach(el => {
                    if (typeof el === "string") {
                      // Only highlight if the text exists in this chunk
                      if (el.includes(note.highlight_text)) {
                        const parts = el.split(note.highlight_text);
                        for (let i = 0; i < parts.length; i++) {
                          newElements.push(parts[i]);
                          if (i < parts.length - 1) {
                            newElements.push(
                              <span 
                                key={`${note.id}-${i}`}
                                className="bg-indigo-900/60 hover:bg-indigo-800/60 text-indigo-200 transition-colors duration-300 rounded px-1 shadow-[0_0_10px_rgba(79,70,229,0.2)] cursor-pointer"
                              >
                                {note.highlight_text}
                              </span>
                            );
                          }
                        }
                      } else {
                        newElements.push(el);
                      }
                    } else {
                      newElements.push(el);
                    }
                  });
                  elements = newElements;
                }
              });

              return (
                <p key={idx} className="mb-8">{elements.map((el, i) => <span key={i}>{el}</span>)}</p>
              );
            })}
          </div>
        </main>

        {/* Right Margin */}
        <aside className="hidden md:flex flex-col flex-[1.5] max-w-[400px] border-l border-white/5 bg-[#0A0F1C] relative">
          <div className="sticky top-16 h-[calc(100vh-64px)] p-6 overflow-y-auto font-sans flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                The Living Margin
              </div>
              <button 
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase"
              >
                + Add Note
              </button>
            </div>

            <AnimatePresence>
              {isAddingNote && (
                 <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900 border border-slate-700 p-4 rounded-xl mb-6 shadow-xl"
                 >
                   <div className="mb-3">
                     <label className="text-xs text-slate-400 mb-1 block">Highlight (Tip: Select text first!)</label>
                     <input 
                       type="text" 
                       value={newHighlightText}
                       onChange={e => setNewHighlightText(e.target.value)}
                       placeholder="Select text in the book..."
                       className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50"
                     />
                   </div>
                   <div className="mb-3">
                     <label className="text-xs text-slate-400 mb-1 block">Your Note</label>
                     <textarea 
                       value={newNoteText}
                       onChange={e => setNewNoteText(e.target.value)}
                       className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 h-24 resize-none focus:outline-none focus:border-indigo-500/50"
                       placeholder="What are your thoughts?"
                     ></textarea>
                   </div>
                   <div className="flex justify-between items-center mt-2">
                     <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                       <input 
                         type="checkbox" 
                         checked={isPublic} 
                         onChange={e => setIsPublic(e.target.checked)}
                         className="accent-indigo-500 w-3.5 h-3.5"
                       />
                       Make Public
                     </label>
                     <div className="flex justify-end gap-2">
                       <button onClick={() => setIsAddingNote(false)} className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-300">Cancel</button>
                       <button onClick={handleSaveNote} className="px-3 py-1.5 rounded text-xs bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">Save</button>
                     </div>
                   </div>
                 </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 space-y-4">
              {annotations.map(note => {
                const isMine = currentUser && note.user_id === currentUser.id;
                const authorName = isMine ? "Me" : (note.profile?.full_name || "Unknown Reader");
                const authorAvatar = note.profile?.avatar_url;
                
                return (
                <div key={note.id} className={`p-5 rounded-2xl shadow-lg transition-colors border ${isMine ? 'bg-indigo-950/20 border-indigo-500/10 hover:border-indigo-500/30' : 'bg-slate-900/40 border-slate-700/30 hover:border-slate-500/50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {authorAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={authorAvatar} alt={authorName} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isMine ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-300'}`}>
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className={`text-xs font-semibold ${isMine ? 'text-indigo-400' : 'text-slate-300'}`}>{authorName}</span>
                      {note.is_public && isMine && <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded ml-1">Public</span>}
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                  {note.highlight_text !== "General Note" && (
                    <div className="relative mb-3">
                      <div className="absolute -left-2 -top-1 text-2xl text-slate-700 opacity-30 font-serif">"</div>
                      <p className="text-slate-400 font-serif leading-relaxed text-sm italic relative z-10 line-clamp-3">
                        {note.highlight_text}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-slate-300 mb-2">
                    {note.note_text}
                  </p>
                </div>
                );
              })}
              
              {annotations.length === 0 && !isAddingNote && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 pb-32">
                  <p className="text-sm mt-10">No annotations yet.<br/>Click "+ Add Note" to create one!</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
