import React from 'react';
import Head from 'next/head';
import TeamLayout from '../components/Layout';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <TeamLayout>
      <Head><title>Settings | Team Admin</title></Head>

      <div className="max-w-2xl">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Company Settings</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">UPDATE ORGANIZATION DETAILS</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm space-y-6">
            <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Company Name</label>
                <input type="text" defaultValue="Microsoft Lagos" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Billing Email</label>
                    <input type="email" defaultValue="accounts@microsoft.com" />
                </div>
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Tax ID / RC</label>
                    <input type="text" defaultValue="RC-12345678" />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Address</label>
                <input type="text" defaultValue="Civic Towers, Victoria Island, Lagos" />
            </div>

            <div className="pt-6 border-t border-[var(--border-color)]">
                <button className="flex items-center px-6 py-3 bg-[var(--color-primary)] text-white font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity">
                    <Save className="w-4 h-4 mr-2" /> SAVE_CHANGES
                </button>
            </div>
        </div>
      </div>
    </TeamLayout>
  );
}
