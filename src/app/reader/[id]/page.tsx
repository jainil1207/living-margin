"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Search, Bookmark, Plus, Heart, Share2, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { addNotification } from "@/lib/notifications";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMarginOpen, setIsMobileMarginOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToNote = (noteId: string) => {
    const el = document.getElementById(`note-${noteId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-terracotta', 'scale-[1.02]');
      setTimeout(() => el.classList.remove('ring-2', 'ring-terracotta', 'scale-[1.02]'), 1500);
    }
  };

  const supabase = createClient();

  useEffect(() => {
    // Clear out any old dark themes from local storage
    localStorage.removeItem("reader-theme");

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

  // Debounce the search input so it doesn't freeze the app on large books
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 400); // 400ms delay

    return () => clearTimeout(handler);
  }, [searchInput]);

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
      
      // Trigger a notification for adding a note
      addNotification("New Note Added", `You added a note on "${book.title}"`, `/reader/${id}#note-${data.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return <div className="min-h-screen bg-white flex flex-col items-center justify-center text-charcoal gap-4">
      <p className="font-bold text-xl">Book not found.</p>
      {errorMsg && <p className="text-red-500 max-w-lg text-center bg-red-50 p-4 rounded-xl border border-red-200">Error details: {errorMsg}</p>}
      <Link href="/catalog" className="px-6 py-2 bg-charcoal text-white rounded-full font-bold hover:bg-slate-800 transition-colors">Back to library</Link>
    </div>;
  }

  // Replace literal '\n' that might have been saved in the DB by mistake during PDF upload
  const cleanContent = book.content.replace(/\\n/g, '\n');
  const paragraphs = cleanContent.split('\n').filter((p: string) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-serif selection:bg-terracotta/30">
       <motion.div
         className="fixed top-0 left-0 right-0 h-1 bg-terracotta origin-left z-[60]"
         style={{ scaleX }}
       />
       <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b bg-white/80 border-slate-200 backdrop-blur-xl font-sans">
        <Link href="/catalog" className="flex items-center gap-2 text-sm font-bold transition-colors text-slate-500 hover:text-charcoal">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Library</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 text-slate-500">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-y-0 left-0 right-0 z-10 flex items-center bg-white px-6 md:static md:w-auto md:bg-transparent md:px-0"
              >
                <div className="relative w-full flex items-center gap-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 md:hidden" />
                  <input
                    autoFocus
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search in book..."
                    className="w-full md:w-[200px] bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 md:py-1.5 md:pl-3 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta font-medium transition-all"
                  />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchInput("");
                      setSearchQuery("");
                    }} 
                    className="md:hidden p-2 text-slate-500 hover:text-charcoal bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery("");
            }}
            className="hidden md:block transition-colors p-2 rounded-xl hover:bg-slate-50 hover:text-charcoal"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => alert("Bookmark saved! You can return to this spot later.")}
            className="hidden md:block transition-colors p-2 rounded-xl hover:bg-slate-50 hover:text-charcoal"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <Link 
            href="/profile"
            className="hidden sm:block transition-colors p-2 rounded-xl hover:bg-slate-50 hover:text-charcoal"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>
      
      <div className="flex max-w-[1400px] mx-auto">
        <div className="hidden lg:flex flex-col flex-1 max-w-[200px] sticky top-[73px] h-[calc(100vh-73px)] p-8 gap-4 font-sans text-slate-500 hover:text-charcoal">
           <div className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Navigation</div>
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})} 
             className="text-left text-sm font-bold hover:translate-x-1 transition-transform"
           >
             Go to Top
           </button>
           <button 
             onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth'})} 
             className="text-left text-sm font-bold hover:translate-x-1 transition-transform"
           >
             Go to Bottom
           </button>
        </div>
        
        <main className="flex-[2] max-w-[750px] px-8 py-16 lg:px-12 leading-loose text-lg lg:text-xl relative font-serif">
          <div className="mb-20 text-center font-sans">
            <h1 className="text-3xl lg:text-5xl font-bold mb-6 font-heading tracking-tight text-charcoal">{book.title}</h1>
            <p className="text-terracotta text-sm font-bold uppercase tracking-widest">{book.author}</p>
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
              let elements: (string | React.ReactNode)[] = [p];

              annotations.forEach(note => {
                if (note.highlight_text && note.highlight_text !== "General Note") {
                  const newElements: (string | React.ReactNode)[] = [];
                  elements.forEach(el => {
                    if (typeof el === "string") {
                      if (el.includes(note.highlight_text)) {
                        const parts = el.split(note.highlight_text);
                        for (let i = 0; i < parts.length; i++) {
                          newElements.push(parts[i]);
                          if (i < parts.length - 1) {
                            newElements.push(
                              <span 
                                key={`${note.id}-${i}`}
                                onClick={() => scrollToNote(note.id)}
                                className="bg-terracotta/20 hover:bg-terracotta/40 text-charcoal transition-colors duration-300 rounded-sm px-1 cursor-pointer hover:opacity-80 decoration-terracotta/30 underline-offset-4"
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

              if (searchQuery.trim().length > 0) {
                const searchLower = searchQuery.toLowerCase();
                const newElements: (string | React.ReactNode)[] = [];
                elements.forEach(el => {
                  if (typeof el === "string") {
                    const elLower = el.toLowerCase();
                    if (elLower.includes(searchLower)) {
                       const regex = new RegExp(`(${searchQuery})`, "gi");
                       const parts = el.split(regex);
                       parts.forEach((part, i) => {
                         if (part.toLowerCase() === searchLower) {
                           newElements.push(
                             <span key={`search-${idx}-${i}`} className="bg-yellow-200 text-charcoal font-bold rounded-sm px-1">
                               {part}
                             </span>
                           );
                         } else {
                           if (part) newElements.push(part);
                         }
                       });
                    } else {
                       newElements.push(el);
                    }
                  } else {
                    newElements.push(el);
                  }
                });
                elements = newElements;
              }

              return (
                <p key={idx} className="mb-8">{elements.map((el, i) => <span key={i}>{el}</span>)}</p>
              );
            })}
          </div>
        </main>

        {/* Right Margin */}
        <aside className="hidden md:flex flex-col flex-[1.5] max-w-[420px] border-l bg-slate-50/50 border-slate-200 relative">
          <div className="sticky top-[73px] h-[calc(100vh-73px)] p-6 overflow-y-auto font-sans flex flex-col scrollbar-hide">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> The Margin
              </div>
              <button 
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="text-xs font-bold text-white bg-charcoal hover:bg-slate-800 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>

            <AnimatePresence>
              {isAddingNote && (
                 <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="border p-5 rounded-2xl mb-8 bg-white border-slate-200 shadow-lg"
                 >
                   <div className="mb-4">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Highlight (Tip: Select text first!)</label>
                     <input 
                       type="text" 
                       value={newHighlightText}
                       onChange={e => setNewHighlightText(e.target.value)}
                       placeholder="Select text in the book..."
                       className="w-full border rounded-xl p-3 text-sm font-medium transition-colors bg-white border-slate-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-300 text-charcoal"
                     />
                   </div>
                   <div className="mb-4">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Your Note</label>
                     <textarea 
                       value={newNoteText}
                       onChange={e => setNewNoteText(e.target.value)}
                       className="w-full border rounded-xl p-3 text-sm font-medium h-28 resize-none transition-colors bg-white border-slate-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-300 text-charcoal"
                       placeholder="What are your thoughts?"
                     ></textarea>
                   </div>
                   <div className="flex justify-between items-center mt-2">
                     <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500">
                       <input 
                         type="checkbox" 
                         checked={isPublic} 
                         onChange={e => setIsPublic(e.target.checked)}
                         className="accent-terracotta w-4 h-4 rounded border-slate-300"
                       />
                       Make Public
                     </label>
                     <div className="flex justify-end gap-2">
                       <button onClick={() => setIsAddingNote(false)} className="px-4 py-2 rounded-full font-bold text-xs text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                       <button onClick={handleSaveNote} className="px-5 py-2 rounded-full font-bold text-xs bg-terracotta text-white hover:bg-[#c4654d] transition-colors shadow-sm">Save</button>
                     </div>
                   </div>
                 </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 space-y-6">
              {annotations.map(note => {
                const isMine = currentUser && note.user_id === currentUser.id;
                const authorName = isMine ? "Me" : (note.profile?.full_name || "Unknown Reader");
                const authorAvatar = note.profile?.avatar_url;
                
                return (
                <motion.div 
                  key={note.id} 
                  id={`note-${note.id}`} 
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl transition-colors transition-shadow duration-300 border ${isMine ? 'bg-white border-terracotta/30 ring-1 ring-terracotta/10 shadow-sm hover:border-terracotta/50' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {authorAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={authorAvatar} alt={authorName} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isMine ? 'bg-terracotta/20 text-terracotta' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className={`text-sm font-bold ${isMine ? 'text-terracotta' : 'text-charcoal'}`}>{authorName}</span>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(note.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {note.is_public && isMine && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-wider">Public</span>}
                  </div>
                  
                  {note.highlight_text !== "General Note" && (
                    <div className="relative mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="font-serif leading-relaxed text-sm italic relative z-10 line-clamp-4 text-slate-600">
                        "{note.highlight_text}"
                      </p>
                    </div>
                  )}
                  
                  <p className="text-sm font-medium mb-4 leading-relaxed text-slate-600">
                    {note.note_text}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                     <button className="text-slate-400 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                     </button>
                     <button className="text-slate-400 hover:text-charcoal transition-colors">
                        <Share2 className="w-4 h-4" />
                     </button>
                  </div>
                </motion.div>
                );
              })}
              
              {annotations.length === 0 && !isAddingNote && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 pb-32">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                    <Bookmark className="w-6 h-6 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">No margin notes</h3>
                  <p className="text-sm font-medium">Be the first to share your thoughts.<br/>Click "+ Add Note" to create one!</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Margin Drawer Overlay */}
        <AnimatePresence>
          {isMobileMarginOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setIsMobileMarginOpen(false)}
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 h-[85vh] bg-slate-50 border-t border-slate-200 rounded-t-3xl flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white rounded-t-3xl">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> The Margin
                  </div>
                  <button onClick={() => setIsMobileMarginOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 pb-32 scrollbar-hide">
                  <div className="flex justify-end mb-6">
                    <button 
                      onClick={() => setIsAddingNote(!isAddingNote)}
                      className="text-xs font-bold text-white bg-terracotta hover:bg-[#c4654d] px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Note
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {isAddingNote && (
                       <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="border p-5 rounded-2xl mb-8 bg-white border-slate-200 shadow-lg"
                       >
                         <div className="mb-4">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Highlight</label>
                           <input 
                             type="text" 
                             value={newHighlightText}
                             onChange={e => setNewHighlightText(e.target.value)}
                             placeholder="Select text in the book..."
                             className="w-full border rounded-xl p-3 text-sm font-medium transition-colors bg-white border-slate-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-300 text-charcoal"
                           />
                         </div>
                         <div className="mb-4">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Your Note</label>
                           <textarea 
                             value={newNoteText}
                             onChange={e => setNewNoteText(e.target.value)}
                             className="w-full border rounded-xl p-3 text-sm font-medium h-28 resize-none transition-colors bg-white border-slate-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-300 text-charcoal"
                             placeholder="What are your thoughts?"
                           ></textarea>
                         </div>
                         <div className="flex justify-between items-center mt-2">
                           <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500">
                             <input 
                               type="checkbox" 
                               checked={isPublic} 
                               onChange={e => setIsPublic(e.target.checked)}
                               className="accent-terracotta w-4 h-4 rounded border-slate-300"
                             />
                             Make Public
                           </label>
                           <div className="flex justify-end gap-2">
                             <button onClick={() => setIsAddingNote(false)} className="px-4 py-2 rounded-full font-bold text-xs text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                             <button onClick={handleSaveNote} className="px-5 py-2 rounded-full font-bold text-xs bg-terracotta text-white hover:bg-[#c4654d] transition-colors shadow-sm">Save</button>
                           </div>
                         </div>
                       </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    {annotations.map(note => {
                      const isMine = currentUser && note.user_id === currentUser.id;
                      const authorName = isMine ? "Me" : (note.profile?.full_name || "Unknown Reader");
                      const authorAvatar = note.profile?.avatar_url;
                      
                      return (
                      <div 
                        key={note.id} 
                        className={`p-5 rounded-2xl border ${isMine ? 'bg-white border-terracotta/30 shadow-sm' : 'bg-white border-slate-200 shadow-sm'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {authorAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={authorAvatar} alt={authorName} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                            ) : (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isMine ? 'bg-terracotta/20 text-terracotta' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                {authorName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <span className={`text-xs font-bold ${isMine ? 'text-terracotta' : 'text-charcoal'}`}>{authorName}</span>
                            </div>
                          </div>
                          {note.is_public && isMine && <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wider">Public</span>}
                        </div>
                        
                        {note.highlight_text !== "General Note" && (
                          <div className="relative mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="font-serif text-xs italic line-clamp-3 text-slate-500">
                              "{note.highlight_text}"
                            </p>
                          </div>
                        )}
                        
                        <p className="text-sm font-medium mb-3 text-slate-700">
                          {note.note_text}
                        </p>
                      </div>
                      );
                    })}
                    
                    {annotations.length === 0 && !isAddingNote && (
                      <div className="flex flex-col items-center justify-center text-center text-slate-400 py-10">
                        <Bookmark className="w-8 h-8 text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-charcoal mb-1">No margin notes</h3>
                        <p className="text-xs font-medium">Click "+ Add Note" to create one!</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Action Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-2 px-6 flex items-center justify-between z-40 pb-safe">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})} className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-terracotta transition-colors">
             <ArrowLeft className="w-5 h-5 rotate-90" />
             <span className="text-[10px] font-bold">Top</span>
          </button>
          <button 
             onClick={() => setIsMobileMarginOpen(true)}
             className="flex flex-col items-center gap-1 p-2 px-6 bg-terracotta text-white rounded-full shadow-lg shadow-terracotta/20 hover:-translate-y-1 transition-all"
          >
             <MessageSquare className="w-5 h-5" />
             <span className="text-[10px] font-bold">Annotations</span>
          </button>
          <button onClick={() => { setIsSearchOpen(!isSearchOpen); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-terracotta transition-colors">
             <Search className="w-5 h-5" />
             <span className="text-[10px] font-bold">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
