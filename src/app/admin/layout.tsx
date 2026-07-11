"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Shield, 
  LogOut, 
  LayoutDashboard, 
  BookCopy, 
  Users, 
  Settings, 
  Globe, 
  Menu, 
  X 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Library", href: "/admin/books", icon: BookCopy },
    { name: "User Accounts", href: "/admin/users", icon: Users },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-slate-900 border-r border-slate-800 h-screen z-10 shadow-2xl shadow-rose-900/10">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20 shadow-inner shadow-rose-500/20">
              <Shield className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-white leading-tight">Admin Portal</h2>
              <p className="text-xs text-rose-400 font-medium">Restricted Access</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-3">
            System Management
          </div>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive 
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-rose-400" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <Link 
            href="/catalog"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-transparent"
          >
            <Globe className="w-5 h-5 text-slate-500" />
            Back to Main Site
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all border border-transparent text-left w-full"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-500" />
            <span className="font-bold tracking-tight text-white">Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 w-72 bg-slate-900 border-l border-slate-800 flex flex-col">
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                <span className="font-bold text-white">Admin Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800"
                  >
                    <item.icon className="w-5 h-5 text-rose-400" />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
                <Link 
                  href="/catalog"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  <Globe className="w-5 h-5" />
                  Main Site
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 text-left w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
          <div className="relative z-10 p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
