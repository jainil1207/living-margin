"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookCopy, Users, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-charcoal mb-2">System Overview</h1>
        <p className="text-slate-500 font-medium">Welcome to the administration dashboard. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-colors transition-shadow duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center border border-terracotta/20">
              <BookCopy className="w-6 h-6 text-terracotta" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Library</p>
              <h2 className="text-3xl font-bold text-charcoal">{stats.books} <span className="text-lg font-medium text-slate-400">books</span></h2>
            </div>
          </div>
          <Link href="/admin/books" className="text-sm text-terracotta hover:text-terracotta/80 font-bold">Manage Library &rarr;</Link>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-colors transition-shadow duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
              <Users className="w-6 h-6 text-charcoal" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
              <h2 className="text-3xl font-bold text-charcoal">{stats.users} <span className="text-lg font-medium text-slate-400">users</span></h2>
            </div>
          </div>
          <Link href="/admin/users" className="text-sm text-charcoal hover:text-slate-600 font-bold">View Users &rarr;</Link>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-colors transition-shadow duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center border border-terracotta/20">
              <TrendingUp className="w-6 h-6 text-terracotta" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">System Status</p>
              <h2 className="text-3xl font-bold text-charcoal">Online</h2>
            </div>
          </div>
          <Link href="/admin/settings" className="text-sm text-terracotta hover:text-terracotta/80 font-bold">System Settings &rarr;</Link>
        </motion.div>
      </div>
    </div>
  );
}
