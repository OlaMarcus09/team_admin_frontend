import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import { Briefcase, ArrowRight, Lock } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate
      const response = await axios.post(`${API_URL}/api/auth/token/`, { email, password });
      const { access, refresh } = response.data;

      // 2. Validate Role
      const profileRes = await axios.get(`${API_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${access}` }
      });

      if (profileRes.data.user_type !== 'TEAM_ADMIN') {
         throw new Error("UNAUTHORIZED_ROLE");
      }

      // 3. Redirect
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      Router.push('/dashboard');

    } catch (err) {
      console.error(err);
      if (err.message === "UNAUTHORIZED_ROLE") {
          setError('ACCESS DENIED: CORPORATE ACCOUNT REQUIRED');
      } else if (err.response?.status === 401) {
          setError('CREDENTIALS_INVALID');
      } else {
          setError('SYSTEM_ERROR: CHECK CONSOLE');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-main)] transition-colors duration-300">
      <Head><title>Team Admin | Workspace OS</title></Head>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] blur-[100px] scale-50"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4 border border-[var(--color-primary)]/20">
                <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] uppercase tracking-wider font-mono">Team Admin</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs mt-2">CORPORATE ACCOUNT MANAGEMENT</p><div className="text-center mt-2"><a href="/signup" className="text-[10px] text-[var(--color-primary)] hover:underline">REGISTER ORGANIZATION</a></div>
        </div>

        <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] p-8 relative rounded-sm shadow-xl">
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-[var(--color-primary)] border-l-[20px] border-l-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Work Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@company.com"
                        className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)]"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)]"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center">
                        <Lock className="w-3 h-3 mr-2" /> {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center group shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                    {loading ? 'CONNECTING...' : 'ACCESS_DASHBOARD'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
