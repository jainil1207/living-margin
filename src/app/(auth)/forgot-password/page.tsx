"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    if (!email) {
      setError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setServerError("");
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setServerError(resetError.message);
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSubmitted(true);
    } catch (err: any) {
      setServerError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 mb-4">
              <BookOpen className="w-6 h-6 text-rose-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
            <p className="text-slate-400 text-sm">We&apos;ll send you instructions to reset your password</p>
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-sm text-red-400"
              >
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      suppressHydrationWarning
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-950 border rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                        error 
                          ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500" 
                          : "border-slate-800 focus:ring-rose-500/50 focus:border-rose-500"
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="text-xs font-medium text-red-400"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative px-8 py-3 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 transition-all hover:bg-rose-500 mt-6 shadow-[0_0_20px_-5px_rgba(225,29,72,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                <p className="text-slate-400 text-sm mb-6">
                  We&apos;ve sent a password reset link to <br/>
                  <span className="text-white font-medium">{email}</span>
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-medium text-rose-400 hover:text-rose-300"
                >
                  Try another email
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-slate-400 mt-8 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to <Link href="/login" className="text-rose-400 font-medium hover:text-rose-300 ml-1">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
