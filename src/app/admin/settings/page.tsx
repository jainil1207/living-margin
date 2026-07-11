"use client";

import { useState } from "react";
import { Settings, Save, Loader2, Database, Shield, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "The Living Margin",
    allowRegistration: true,
    maintenanceMode: false,
    maxUploadSize: "50",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // In a real app, this would save to a configuration table in Supabase
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully! (Demo)");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure global application settings and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/20 flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">General Configuration</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-medium text-slate-300">Site Name</label>
              <input 
                type="text" 
                value={settings.siteName}
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/20 flex items-center gap-3">
            <Shield className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-semibold text-white">Security & Access</h2>
          </div>
          <div className="p-6 space-y-6">
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.allowRegistration}
                  onChange={e => setSettings({...settings, allowRegistration: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
              <div>
                <div className="text-white font-medium">Allow New Registrations</div>
                <div className="text-sm text-slate-400">Users can create new accounts</div>
              </div>
            </label>

            <label className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </div>
              <div>
                <div className="text-white font-medium">Maintenance Mode</div>
                <div className="text-sm text-slate-400">Disable public access temporarily</div>
              </div>
            </label>
          </div>
        </div>

        {/* File Storage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/20 flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Storage Limits</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2 max-w-xs">
              <label className="text-sm font-medium text-slate-300">Max PDF Upload Size (MB)</label>
              <input 
                type="number" 
                value={settings.maxUploadSize}
                onChange={e => setSettings({...settings, maxUploadSize: e.target.value})}
                className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
