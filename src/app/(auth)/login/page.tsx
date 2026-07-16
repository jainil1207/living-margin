"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors({ server: error.message });
        setIsSubmitting(false);
        return;
      }

      if (role === 'admin') {
        if (data.session?.user?.user_metadata?.role !== 'admin') {
          if (email === "trivedijainil88@gmail.com") {
            await supabase.auth.updateUser({ data: { role: 'admin' } });
          } else {
            await supabase.auth.signOut();
            setErrors({ server: "Unauthorized. Administrative access only." });
            setIsSubmitting(false);
            return;
          }
        }
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
      
    } catch (error: any) {
      setErrors({ server: error.message || "An error occurred during login" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        setErrors({ server: error.message });
      }
    } catch (e: any) {
      setErrors({ server: e.message || 'An error occurred during authentication' });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-offwhite">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terracotta/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Image 
                src="/logo.png" 
                alt="The Living Margin Logo" 
                width={48} 
                height={48} 
                className="rounded-xl object-cover border border-slate-100 shadow-sm"
              />
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-charcoal mb-2">Welcome back</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to access your library</p>
          </div>

          <AnimatePresence>
            {errors.server && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600"
              >
                {errors.server}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div className="relative flex bg-slate-100 p-1 rounded-xl mb-4 shadow-inner">
              {/* Animated sliding box */}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm border border-slate-200/50"
                initial={false}
                animate={{
                  left: role === 'user' ? '4px' : 'calc(50%)',
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              
              <button 
                suppressHydrationWarning
                type="button"
                onClick={() => setRole('user')}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 ${role === 'user' ? 'text-terracotta' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Reader
              </button>
              <button 
                suppressHydrationWarning
                type="button"
                onClick={() => setRole('admin')}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 ${role === 'admin' ? 'text-terracotta' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Admin
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  suppressHydrationWarning
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-offwhite border rounded-xl py-3 pl-10 pr-4 text-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? "border-red-300 focus:ring-red-500/30 focus:border-red-500" 
                      : "border-slate-200 focus:ring-terracotta/30 focus:border-terracotta"
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-medium text-red-500"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-charcoal">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-terracotta hover:text-[#c4654d]">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  suppressHydrationWarning
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-offwhite border rounded-xl py-3 pl-10 pr-4 text-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? "border-red-300 focus:ring-red-500/30 focus:border-red-500" 
                      : "border-slate-200 focus:ring-terracotta/30 focus:border-terracotta"
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-medium text-red-500"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button 
              suppressHydrationWarning
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative px-8 py-3 rounded-xl bg-charcoal text-white font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-800 mt-6 shadow-subtle hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs text-slate-400 font-medium uppercase">Or continue with</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              suppressHydrationWarning
              type="button"
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 hover:bg-offwhite transition-colors text-sm font-semibold text-charcoal shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.96-1.385-.09-.225-.48-1.385-1.02-1.665-.435-.24-1.05-.81-.015-.825.975-.015 1.665.885 1.89 1.26 1.11 1.89 2.91 1.35 3.615 1.035.12-.81.435-1.35.795-1.665-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.45.39.855 1.155.855 2.325 0 1.68-.015 3.045-.015 3.465 0 .33.225.69.84.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
            <button 
              suppressHydrationWarning
              type="button"
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 hover:bg-offwhite transition-colors text-sm font-semibold text-charcoal shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don&apos;t have an account? <Link href="/register" className="text-terracotta font-semibold hover:text-[#c4654d]">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
