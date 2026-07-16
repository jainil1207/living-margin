"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getNotifications, markAllAsRead, Notification } from "@/lib/notifications";
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
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const updateNotifications = () => {
      const notifs = getNotifications();
      setNotifications(notifs);
      setUnreadNotifications(notifs.filter(n => !n.isRead).length);
    };

    updateNotifications();

    window.addEventListener('app-notifications-updated', updateNotifications);
    return () => window.removeEventListener('app-notifications-updated', updateNotifications);
  }, []);

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
    return <div className="min-h-screen bg-offwhite flex items-center justify-center text-charcoal">Loading...</div>;
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
    <div className="min-h-screen bg-offwhite flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="The Living Margin Logo" 
              width={32} 
              height={32} 
              className="rounded-lg object-cover border border-slate-200"
            />
            <span className="font-heading font-bold text-lg tracking-tight text-charcoal">The Living Margin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  isActive 
                    ? "bg-slate-100 text-terracotta" 
                    : "text-slate-500 hover:text-charcoal hover:bg-slate-50"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-terracotta" : "text-slate-400 group-hover:text-charcoal"}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-2">
            <button 
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 hover:text-charcoal hover:bg-slate-50 transition-all group text-sm font-medium"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-400 group-hover:text-charcoal transition-colors" />
                <span>General Settings</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSettingsExpanded ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-200 ${isSettingsExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-col gap-1 pl-10 pr-2">
                <Link href="/profile" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/profile' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                  <User className="w-4 h-4 opacity-70" />
                  Profile
                </Link>
                <Link href="/appearance" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/appearance' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                  <Palette className="w-4 h-4 opacity-70" />
                  Appearance
                </Link>
                <Link href="/security" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/security' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                  <Shield className="w-4 h-4 opacity-70" />
                  Security
                </Link>
                <Link href="/notifications" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/notifications' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                  <Bell className="w-4 h-4 opacity-70" />
                  Notifications
                </Link>
                <Link href="/billing" className={`flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors ${pathname === '/billing' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                  <CreditCard className="w-4 h-4 opacity-70" />
                  Billing
                </Link>
                <div className="h-px w-full bg-slate-200 my-1"></div>
                <button onClick={handleSignOut} className="flex items-center gap-2 py-2 px-3 rounded-xl text-sm transition-colors text-red-500 hover:bg-red-50 font-medium text-left">
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
            className="md:hidden fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Image 
                  src="/logo.png" 
                  alt="The Living Margin Logo" 
                  width={28} 
                  height={28} 
                  className="rounded-md object-cover border border-slate-200"
                />
                <span className="font-heading font-bold text-lg tracking-tight text-charcoal">The Living Margin</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive 
                        ? "bg-slate-100 text-terracotta" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-charcoal"
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
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 hover:text-charcoal hover:bg-slate-50 transition-all group font-medium"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span>General Settings</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isSettingsExpanded ? "rotate-180" : ""}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-200 ${isSettingsExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                  <div className="flex flex-col gap-1 pl-12 pr-4">
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/profile' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                      <User className="w-4 h-4 opacity-70" />
                      Profile
                    </Link>
                    <Link href="/appearance" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/appearance' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                      <Palette className="w-4 h-4 opacity-70" />
                      Appearance
                    </Link>
                    <Link href="/security" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/security' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                      <Shield className="w-4 h-4 opacity-70" />
                      Security
                    </Link>
                    <Link href="/notifications" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/notifications' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                      <Bell className="w-4 h-4 opacity-70" />
                      Notifications
                    </Link>
                    <Link href="/billing" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors ${pathname === '/billing' ? 'bg-slate-100 text-terracotta font-medium' : 'text-slate-500 hover:text-charcoal hover:bg-slate-50'}`}>
                      <CreditCard className="w-4 h-4 opacity-70" />
                      Billing
                    </Link>
                    <div className="h-px w-full bg-slate-200 my-1"></div>
                    <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="flex items-center gap-2 py-2.5 px-3 rounded-xl transition-colors font-medium text-red-500 hover:bg-red-50 text-left">
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
        <header className="h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-charcoal"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="hidden md:block text-xl font-heading font-bold text-charcoal tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-charcoal hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full border border-white animate-pulse"></span>}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute top-12 right-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-semibold text-charcoal">Notifications</h3>
                  <div className="flex items-center gap-3">
                    {unreadNotifications > 0 && (
                      <button 
                        onClick={() => {
                          markAllAsRead();
                        }}
                        className="text-xs font-semibold text-terracotta hover:text-[#c4654d]"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-charcoal">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            if (notif.link) {
                              router.push(notif.link);
                              setIsNotificationsOpen(false);
                            }
                          }}
                          className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${notif.link ? 'cursor-pointer' : ''} ${!notif.isRead ? 'bg-terracotta/5' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-medium ${!notif.isRead ? 'text-charcoal font-semibold' : 'text-slate-600'}`}>{notif.title}</h4>
                            <span className="text-[10px] font-medium text-slate-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <Bell className="w-8 h-8 mx-auto mb-3 text-slate-200" />
                      <p className="text-sm font-medium text-charcoal">You're all caught up!</p>
                      <p className="text-xs mt-1 text-slate-400">No new notifications right now.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 hover:scale-105 active:scale-95 transition-all duration-200"
                title="Profile Menu"
              >
                <div className="w-9 h-9 rounded-full bg-charcoal flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent hover:ring-slate-200 transition-all">
                  {profile?.full_name ? (
                    profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                  ) : (
                    "U"
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute top-12 right-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="font-semibold text-charcoal truncate">{profile?.full_name || "User"}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Logged in</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-charcoal hover:bg-slate-100 transition-all"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Profile Settings
                    </Link>
                    <div className="h-px w-full bg-slate-100 my-2"></div>
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleSignOut();
                      }} 
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
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
