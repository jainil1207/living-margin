"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, Save, Loader2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // Fetch profile from DB
      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (data) {
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [router, supabase]);

  const [imageError, setImageError] = useState(false);

  // When avatarUrl changes, reset the error state so it tries to load the new one
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    const updates = {
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
    };

    const { error, data } = await supabase.from("profiles").upsert(updates).select();
    
    if (error) {
      alert("Error updating profile: " + (error.message || JSON.stringify(error)));
      console.error("Supabase upsert error:", error);
    } else {
      // Also update auth user metadata so session matches
      const authRes = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl
        }
      });
      if (authRes.error) {
        console.error("Auth update error:", authRes.error);
      }
      
      // Clear inputs upon successful save
      setFullName("");
      setAvatarUrl("");
      
      alert("Profile updated successfully!");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Your Profile</h1>
        <p className="text-slate-400">Manage your public identity on The Living Margin.</p>
      </div>

      <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-indigo-500/30 overflow-hidden flex items-center justify-center">
                {avatarUrl && !imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={() => setImageError(true)} />
                ) : (
                  <User className="w-10 h-10 text-slate-500" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-slate-300">Avatar URL</label>
              <input 
                type="url" 
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-slate-500">Paste an image URL to update your avatar.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Display Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. John Doe"
            />
            <p className="text-xs text-slate-500">This name will appear on all your public annotations.</p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
