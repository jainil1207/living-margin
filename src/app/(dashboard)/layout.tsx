"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  LayoutDashboard, 
  Library, 
  PenTool, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search,
  LogOut,
  ChevronDown,
  User,
  Palette,
  Shield,
  CreditCard
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Auth Guard
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setIsLoading(false);
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) setProfile(data);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Library", href: "/catalog", icon: Library },
    { name: "Annotations", href: "/annotations", icon: PenTool },
    { name: "Community", href: "/community", icon: Users },
  ];

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Overview';
    if (pathname.includes('/catalog')) return 'Library Catalog';
    if (pathname.includes('/annotations')) return 'My Annotations';
    if (pathname.includes('/community')) return 'Community Feed';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/appearance')) return 'Appearance Settings';
    if (pathname.includes('/security')) return 'Security Settings';
    if (pathname.includes('/notifications')) return 'Notification Settings';
    if (pathname.includes('/billing')) return 'Billing & Subscription';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="The Living Margin Logo" 
              width={32} 
              height={32} 
              className="rounded-md object-cover bg-slate-900 border border-slate-800"
            />
            <span className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">The Living Margin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-semibold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-2">
            <button 
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all group text-sm"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
                <span>General Settings</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isSettingsExpanded ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-200 ${isSettingsExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-col gap-1 pl-10 pr-2">
                <Link href="/profile" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/profile' ? 'bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}>
                  <User className="w-4 h-4 opacity-70" />
                  Profile
                </Link>
                <Link href="/appearance" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/appearance' ? 'bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}>
                  <Palette className="w-4 h-4 opacity-70" />
                  Appearance
                </Link>
                <Link href="/security" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/security' ? 'bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}>
                  <Shield className="w-4 h-4 opacity-70" />
                  Security
                </Link>
                <Link href="/notifications" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/notifications' ? 'bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}>
                  <Bell className="w-4 h-4 opacity-70" />
                  Notifications
                </Link>
                <Link href="/billing" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/billing' ? 'bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}>
                  <CreditCard className="w-4 h-4 opacity-70" />
                  Billing
                </Link>
                <div className="h-px w-full bg-slate-800 my-1"></div>
                <button onClick={handleSignOut} className="flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left">
                  <LogOut className="w-4 h-4 opacity-70" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Image 
                  src="/logo.png" 
                  alt="The Living Margin Logo" 
                  width={28} 
                  height={28} 
                  className="rounded-md object-cover bg-slate-900 border border-slate-800"
                />
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">The Living Margin</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? "bg-indigo-500/10 text-indigo-400 font-medium" 
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}

              <div className="mt-2">
                <button 
                  onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span>General Settings</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isSettingsExpanded ? "rotate-180" : ""}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-200 ${isSettingsExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                  <div className="flex flex-col gap-1 pl-12 pr-4">
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/profile' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                      <User className="w-4 h-4 opacity-70" />
                      Profile
                    </Link>
                    <Link href="/appearance" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/appearance' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                      <Palette className="w-4 h-4 opacity-70" />
                      Appearance
                    </Link>
                    <Link href="/security" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/security' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                      <Shield className="w-4 h-4 opacity-70" />
                      Security
                    </Link>
                    <Link href="/notifications" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/notifications' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                      <Bell className="w-4 h-4 opacity-70" />
                      Notifications
                    </Link>
                    <Link href="/billing" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/billing' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                      <CreditCard className="w-4 h-4 opacity-70" />
                      Billing
                    </Link>
                    <div className="h-px w-full bg-slate-800 my-1"></div>
                    <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left">
                      <LogOut className="w-4 h-4 opacity-70" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="hidden md:block text-lg font-semibold text-slate-200">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {!isNotificationsOpen && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-950 animate-pulse"></span>}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute top-12 right-12 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-200">Notifications</h3>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-8 text-center text-slate-500">
                  <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm text-slate-300">You're all caught up!</p>
                  <p className="text-xs mt-1 text-slate-500">No new notifications right now.</p>
                </div>
              </div>
            )}

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 hover:scale-105 active:scale-95 transition-all duration-200"
                title="Profile Menu"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-transparent hover:ring-indigo-500/50 transition-all">
                  {profile?.full_name ? (
                    profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                  ) : (
                    "U"
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute top-12 right-0 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-800">
                    <p className="font-semibold text-slate-200">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Logged in</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Profile Settings
                    </Link>
                    <div className="h-px w-full bg-slate-800 my-2"></div>
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleSignOut();
                      }} 
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
