"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, BookPlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Fiction");

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== "trivedijainil88@gmail.com") {
        router.push("/catalog");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router, supabase]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !content) {
      alert("Title, Author, and Content are required.");
      return;
    }

    setIsUploading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to upload a book.");
      setIsUploading(false);
      return;
    }

    const newBook = {
      title,
      author,
      description,
      cover_image_url: coverUrl || null,
      content,
      category
    };

    const { data, error } = await supabase.from("books").insert(newBook).select().single();

    if (error) {
      alert("Upload failed: " + error.message);
      setIsUploading(false);
    } else if (data) {
      // Redirect to the reader page for the new book
      router.push(`/reader/${data.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <BookPlus className="w-8 h-8 text-indigo-400" />
          Add to Library
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Paste the raw text of a book to automatically generate an interactive eReader experience.
        </p>
      </div>

      <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Book Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="e.g. The Great Gatsby"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Author</label>
              <input 
                type="text" 
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
                className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="e.g. F. Scott Fitzgerald"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none h-24"
              placeholder="A brief summary of the book..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Cover Image URL (Optional)</label>
              <input 
                type="url" 
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="https://example.com/cover.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
              <span>Full Book Content</span>
              <span className="text-xs text-indigo-400 font-normal">Copy/paste from Project Gutenberg</span>
            </label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all h-64 font-mono text-sm leading-relaxed"
              placeholder="Paste the entire text of the book here..."
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Book...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload & Read
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
