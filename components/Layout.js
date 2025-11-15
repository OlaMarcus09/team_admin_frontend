import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, BarChart3, Settings, LogOut } from 'lucide-react';

const NavLink = ({ href, children, isActive, icon: Icon }) => (
  <Link href={href} legacyBehavior>
    <a
      className={`
        flex items-center px-4 py-3 text-sm font-medium rounded-lg
        transition-colors
        ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </a>
  </Link>
);

export default function TeamAdminLayout({ children, activePage }) {

  const handleLogout = () => {
    localStorage.clear();
    Router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* --- Sidebar --- */}
      <div className="flex flex-col w-64 bg-background border-r">
        {/* Logo Header */}
        <div className="flex items-center justify-center h-20 border-b">
          <img 
            src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" 
            alt="Workspace Africa Logo"
            className="h-10"
          />
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            href="/dashboard" 
            isActive={activePage === 'dashboard'} 
            icon={LayoutDashboard}
          >
            Dashboard
          </NavLink>
          <NavLink 
            href="/members" 
            isActive={activePage === 'members'} 
            icon={Users}
          >
            Members
          </NavLink>
          <NavLink 
            href="/billing" 
            isActive={activePage === 'billing'} 
            icon={CreditCard}
          >
            Billing
          </NavLink>
          <NavLink 
            href="/analytics" 
            isActive={activePage === 'analytics'} 
            icon={BarChart3}
          >
            Analytics
          </NavLink>
          <NavLink 
            href="/settings" 
            isActive={activePage === 'settings'} 
            icon={Settings}
          >
            Settings
          </NavLink>
        </nav>

        {/* Footer / Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
