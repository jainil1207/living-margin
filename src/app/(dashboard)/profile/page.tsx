"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { User, Image as ImageIcon, Save, Check, ExternalLink, PenTool } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchProfileAndNotes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setAvatarUrl(profileData.avatar_url || "");
      }

      // Fetch User's Annotations with books joined
      const { data: notesData } = await supabase
        .from("annotations")
        .select("*, books(title, cover_url)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (notesData) {
         if (notesData.length > 0 && notesData[0].books) {
            setAnnotations(notesData);
         } else {
            // Manual fallback if FK fails
            const { data: books } = await supabase.from("books").select("id, title, cover_url");
            const bookMap = new Map(books?.map(b => [b.id, b]) || []);
            const enriched = notesData.map(n => ({
              ...n,
              books: bookMap.get(n.book_id)
            }));
            setAnnotations(enriched);
         }
      }
      
      setIsLoading(false);
    };

    fetchProfileAndNotes();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, avatar_url: avatarUrl })
      .eq("id", session.user.id);

    setIsSaving(false);
    if (!error) {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
      setProfile({ ...profile, full_name: fullName, avatar_url: avatarUrl });
    } else {
      alert("Error saving profile: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
      
      {/* Profile Editor */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">Manage your identity and appearance.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
           {/* Abstract Background Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
           
           <div className="flex justify-center mb-8 relative z-10">
             <div className="relative">
               {avatarUrl ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-slate-800 bg-slate-900 shadow-xl" />
               ) : (
                 <div className="w-32 h-32 rounded-full bg-indigo-500/20 border-4 border-slate-800 flex items-center justify-center shadow-xl">
                   <User className="w-12 h-12 text-indigo-400" />
                 </div>
               )}
             </div>
           </div>

           <div className="space-y-4 relative z-10">
             <div>
               <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input 
                   type="text" 
                   value={fullName}
                   onChange={e => setFullName(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                   placeholder="Your name"
                 />
               </div>
             </div>
             
             <div>
               <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Avatar Image URL</label>
               <div className="relative">
                 <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input 
                   type="url" 
                   value={avatarUrl}
                   onChange={e => setAvatarUrl(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                   placeholder="https://example.com/avatar.jpg"
                 />
               </div>
             </div>

             <button 
               onClick={handleSaveProfile}
               disabled={isSaving}
               className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {isSaving ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : showSavedToast ? (
                 <>
                   <Check className="w-5 h-5" />
                   Saved!
                 </>
               ) : (
                 <>
                   <Save className="w-5 h-5" />
                   Save Changes
                 </>
               )}
             </button>
           </div>
        </div>
      </div>

      {/* User's Annotations */}
      <div className="w-full lg:w-2/3">
         <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">My Library Notes</h2>
              <p className="text-slate-400">All of your highlights and thoughts across every book.</p>
            </div>
            <div className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/20">
              {annotations.length} Notes Total
            </div>
         </div>

         {annotations.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <PenTool className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No notes yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                You haven't added any notes to your books yet. Go read something and share your thoughts!
              </p>
              <Link href="/catalog" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                Go to Catalog
              </Link>
            </div>
         ) : (
            <div className="space-y-4">
              {annotations.map((note) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={note.id} 
                  className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-slate-800 rounded shadow overflow-hidden">
                        {note.books?.cover_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={note.books.cover_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{note.books?.title || "Unknown Book"}</div>
                        <div className="text-xs text-slate-500">{new Date(note.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       {note.is_public && (
                         <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                           Public
                         </span>
                       )}
                       <Link href={`/reader/${note.book_id}`} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white group">
                         <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                       </Link>
                    </div>
                  </div>
                  
                  <div className="pl-14">
                    {note.highlight_text && note.highlight_text !== "General Note" && (
                      <div className="relative mb-3">
                        <div className="absolute -left-3 -top-1 w-1 h-full bg-indigo-500/30 rounded-full" />
                        <p className="text-sm font-serif italic text-slate-400 leading-relaxed">
                          "{note.highlight_text}"
                        </p>
                      </div>
                    )}
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {note.note_text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
         )}
      </div>
    </div>
  );
}
