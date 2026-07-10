export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      
      {/* Background ambient gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Read Between the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">
            Living Margins.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Experience your library dynamically. Annotate, share insights, and connect over the written word in a beautifully immersive reading canvas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all duration-300 w-full sm:w-auto">
            Get Started
          </button>
          <button className="px-8 py-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-300 w-full sm:w-auto ring-1 ring-slate-300 dark:ring-slate-700">
            Explore the Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
