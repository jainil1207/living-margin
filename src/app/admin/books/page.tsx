"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, BookPlus, Loader2, Trash2, Book } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function AdminBooksPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [books, setBooks] = useState<any[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoadingBooks(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      // Deduplicate by title to hide duplicates that couldn't be deleted due to RLS
      const uniqueBooks = data.filter((book, index, self) => 
        index === self.findIndex((b) => b.title === book.title)
      );
      setBooks(uniqueBooks);
    }
    setIsLoadingBooks(false);
  };

  const handleDeleteBook = async (bookId: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    // Optional: Extract file path from URL to delete from storage as well
    // But for now, we just delete the database record
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);

    if (error) {
      alert("Error deleting book: " + error.message);
    } else {
      setBooks(books.filter(b => b.id !== bookId));
    }
  };

  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      // Extract up to 50 pages to prevent browser hanging on massive books for this demo
      const numPages = Math.min(pdf.numPages, 50); 
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + "\n\n";
      }
      return fullText;
    } catch (err) {
      console.error("PDF Extraction error:", err);
      return "Could not extract text from this PDF.";
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !file) {
      alert("Title, Author, and a PDF File are required.");
      return;
    }

    setIsUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("You must be logged in to upload a book.");
      setIsUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    // Instead of uploading to Supabase Storage, we extract the text immediately
    // and save it directly to the database!
    const extractedContent = await extractTextFromPDF(file);

    const newBook = {
      title,
      author,
      cover_url: coverUrl || null,
      content: extractedContent || "No readable text found in PDF."
    };

    const { data, error } = await supabase.from("books").insert(newBook).select().single();

    if (error) {
      alert("Database error: " + error.message);
      setIsUploading(false);
    } else if (data) {
      alert("Book uploaded successfully!");
      setTitle(""); setAuthor(""); setDescription(""); setCoverUrl(""); setFile(null);
      setShowUploadForm(false);
      fetchBooks();
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-charcoal mb-2">Manage Library</h1>
          <p className="text-slate-500 font-medium">View and manage all uploaded books.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              if (!confirm("Add demo books to the library?")) return;
              const demoBooks = [
                { title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover_url: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg", content: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since..." },
                { title: "1984", author: "George Orwell", cover_url: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg", content: "It was a bright cold day in April, and the clocks were striking thirteen..." },
                { title: "Pride and Prejudice", author: "Jane Austen", cover_url: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg", content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife..." },
                { title: "Frankenstein", author: "Mary Shelley", cover_url: "https://upload.wikimedia.org/wikipedia/commons/3/35/Frankenstein_1818_edition_title_page.jpg", content: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings..." }
              ];
              const { error } = await supabase.from('books').insert(demoBooks);
              if (error) alert("Error seeding books: " + error.message);
              else { alert("Demo books added!"); fetchBooks(); }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm"
          >
            Seed Demo Books
          </button>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-white rounded-xl font-bold transition-all shadow-sm"
          >
            {showUploadForm ? "Cancel Upload" : <><BookPlus className="w-5 h-5" /> Upload New Book</>}
          </button>
        </div>
      </div>

      {showUploadForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <h2 className="text-xl font-bold text-charcoal mb-6">Upload Book PDF</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Book Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-charcoal font-medium focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-colors shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Author</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-charcoal font-medium focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-colors shadow-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-charcoal font-medium focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-colors shadow-sm resize-none h-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cover Image URL (Optional)</label>
                <input type="url" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-charcoal font-medium focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-colors shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>PDF File</span>
                  <span className="text-[10px] text-terracotta">Max 50MB</span>
                </label>
                <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-charcoal font-medium focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-colors shadow-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-terracotta/10 file:text-terracotta hover:file:bg-terracotta/20 file:transition-colors" />
              </div>
            </div>
            <button type="submit" disabled={isUploading} className="w-full py-4 bg-terracotta hover:bg-terracotta/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm">
              {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Upload className="w-5 h-5" /> Upload to Library</>}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoadingBooks ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : books.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center text-slate-500">
            <Book className="w-12 h-12 mb-4 text-slate-300" />
            <p className="font-medium">No books uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-charcoal">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 rounded-tl-2xl">Book</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Added</th>
                  <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.cover_url ? (
                          <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 shadow-sm border border-slate-200">
                            <Image src={book.cover_url} alt={book.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-14 bg-slate-100 rounded flex items-center justify-center shrink-0 border border-slate-200">
                            <Book className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <span className="font-bold text-charcoal line-clamp-1">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{book.author}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{new Date(book.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteBook(book.id, book.file_url)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
