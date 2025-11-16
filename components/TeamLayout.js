import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { Home, Users, CreditCard, Settings, Sparkles, Building2 } from 'lucide-react';

const NavLink = ({ href, children, isActive, icon: Icon }) => (
  <Link href={href} legacyBehavior>
    <a className={`
      flex flex-col items-center justify-center flex-1 py-3
      transition-all duration-200 relative
      ${isActive 
        ? 'text-purple-400 scale-105' 
        : 'text-gray-500 hover:text-gray-300'
      }
    `}>
      <div className={`relative ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
        <Icon className="w-6 h-6" />
        {isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        )}
      </div>
      <span className="text-xs font-medium mt-1">{children}</span>
      
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
      )}
    </a>
  </Link>
);

export default function TeamLayout({ children, activePage, user, team }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      
      {/* --- Modern Header --- */}
      <header className="sticky top-0 z-10 w-full py-4 bg-black/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="container flex items-center justify-between px-4 mx-auto max-w-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Team Admin
            </span>
          </div>
          
          {/* Team Badge */}
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-white text-sm font-medium">{team?.name || 'Your Team'}</p>
              <p className="text-gray-400 text-xs">Team Admin</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || 'T'}
            </div>
          </div>
        </div>
      </header>
      
      {/* --- Main Content Area --- */}
      <main className="flex-1 w-full max-w-lg p-4 pb-24 mx-auto overflow-y-auto">
        {children}
      </main>

      {/* --- Enhanced Bottom Tab Bar --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 h-16 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 shadow-2xl flex px-4">
        <NavLink href="/team" isActive={activePage === 'dashboard'} icon={Home}>
          Dashboard
        </NavLink>
        <NavLink href="/team/members" isActive={activePage === 'members'} icon={Users}>
          Members
        </NavLink>
        <NavLink href="/team/billing" isActive={activePage === 'billing'} icon={CreditCard}>
          Billing
        </NavLink>
        <NavLink href="/team/settings" isActive={activePage === 'settings'} icon={Settings}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
}
