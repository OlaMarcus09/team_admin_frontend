import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Briefcase } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const SidebarItem = ({ href, icon: Icon, label, isActive }) => (
  <Link href={href} legacyBehavior>
    <a className={`flex items-center px-4 py-3 mb-1 transition-colors border-r-2 ${isActive ? 'bg-[var(--bg-input)] border-[var(--color-primary)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]'}`}>
      <Icon className="w-4 h-4 mr-3" />
      <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
    </a>
  </Link>
);

export default function TeamLayout({ children }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex-shrink-0 fixed inset-y-0 left-0 z-50 transition-colors duration-300 flex flex-col">
        
        {/* Branding */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)] flex-shrink-0">
            <div className="w-8 h-8 bg-[var(--color-primary)]/10 flex items-center justify-center rounded-sm border border-[var(--color-primary)]/20 mr-3">
                <Briefcase className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Corporate</div>
                <div className="font-bold font-mono text-sm tracking-tight">TEAM_ADMIN</div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 overflow-y-auto">
            <div className="px-6 mb-2 text-[10px] font-mono text-[var(--text-muted)] uppercase">Management</div>
            <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Overview" isActive={router.pathname === '/dashboard'} />
            <SidebarItem href="/members" icon={Users} label="Employees" isActive={router.pathname === '/members'} />
            <SidebarItem href="/billing" icon={CreditCard} label="Finance" isActive={router.pathname === '/billing'} />
            <SidebarItem href="/settings" icon={Settings} label="Organization" isActive={router.pathname === '/settings'} />
        </nav>

        {/* Footer / Theme */}
        <div className="p-4 border-t border-[var(--border-color)] space-y-3 flex-shrink-0 bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between px-2 text-[10px] font-mono text-[var(--text-muted)] uppercase">
                <span>Interface</span>
                <ThemeToggle className="w-full ml-2" />
            </div>

            <button 
                onClick={() => { localStorage.clear(); router.push('/'); }}
                className="flex items-center w-full px-4 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors rounded-sm border border-transparent hover:border-red-500/20"
            >
                <LogOut className="w-4 h-4 mr-3" />
                SIGN_OUT
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 transition-all duration-300">
        <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-main)]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between transition-colors duration-300">
            <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                WORKSPACE_AFRICA_ENTERPRISE
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <div className="font-mono text-xs text-[var(--text-main)]">Microsoft Lagos</div>
                    <div className="text-[10px] text-[var(--color-primary)]">PLAN: ENTERPRISE_V1</div>
                </div>
                <div className="w-8 h-8 bg-[var(--bg-surface)] rounded-sm border border-[var(--border-color)] flex items-center justify-center font-bold font-mono text-xs">MS</div>
            </div>
        </header>
        
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
