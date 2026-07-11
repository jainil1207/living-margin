import { Palette } from "lucide-react";

export default function AppearancePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Palette className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-200">Appearance Settings</h1>
            <p className="text-slate-400 text-sm">Customize the look and feel of your workspace.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-12 border-2 border-dashed border-slate-800 rounded-xl text-center">
            <h3 className="text-slate-300 font-medium mb-2">Coming Soon</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Theme selection, font preferences, and custom layouts will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
