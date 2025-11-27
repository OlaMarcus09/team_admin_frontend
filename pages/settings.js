import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import TeamLayout from '../components/Layout';

export default function SettingsPage() {
  const [company, setCompany] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCompany = async () => {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${API_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCompany(res.data);
    };
    fetchCompany();
  }, []);

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
                <input type="text" value={company?.username || 'Loading...'} readOnly className="bg-[var(--bg-input)]" />
            </div>
            <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Billing Email</label>
                <input type="email" value={company?.email || 'Loading...'} readOnly className="bg-[var(--bg-input)]" />
            </div>
        </div>
      </div>
    </TeamLayout>
  );
}
