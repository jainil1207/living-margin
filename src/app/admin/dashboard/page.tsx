"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookCopy, Users, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ books: 0, users: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Get books count
      const { count: booksCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });
        
      // Get users count (from profiles)
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        books: booksCount || 0,
        users: usersCount || 0
      });
      setIsLoading(false);
    };

    fetchStats();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">System Overview</h1>
        <p className="text-slate-400">Welcome to the administration dashboard. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
              <BookCopy className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Library</p>
              <h2 className="text-3xl font-bold text-white">{stats.books} <span className="text-lg font-normal text-slate-500">books</span></h2>
            </div>
          </div>
          <Link href="/admin/books" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Manage Library &rarr;</Link>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Registered Users</p>
              <h2 className="text-3xl font-bold text-white">{stats.users} <span className="text-lg font-normal text-slate-500">users</span></h2>
            </div>
          </div>
          <Link href="/admin/users" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">View Users &rarr;</Link>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
              <TrendingUp className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">System Status</p>
              <h2 className="text-3xl font-bold text-white">Online</h2>
            </div>
          </div>
          <Link href="/admin/settings" className="text-sm text-rose-400 hover:text-rose-300 font-medium">System Settings &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
