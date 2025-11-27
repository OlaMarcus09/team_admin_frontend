import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamLayout from '../components/Layout';
import { Users, Mail, CreditCard, Calendar, ArrowUpRight } from 'lucide-react';

const MetricBlock = ({ label, value, sub, icon: Icon, trend }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
    <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[var(--bg-input)] rounded-sm text-[var(--color-primary)]">
            <Icon className="w-5 h-5" />
        </div>
    </div>
    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-mono font-bold text-[var(--text-main)] mb-1">{value}</div>
    <div className="text-xs text-[var(--text-muted)] font-mono">{sub}</div>
  </div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState({ name: 'Loading...', members: [] });
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) { Router.push('/'); return; }

            // 1. Fetch Profile (Contains Team Info)
            const response = await axios.get(`${API_URL}/api/users/me/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // 2. Set Real Data
            setTeam({
                name: response.data.username || 'My Organization',
                // If your backend sends a 'members' list in the user profile, use it.
                // Otherwise, we default to 1 (the admin)
                members: response.data.team_members || [response.data] 
            });

        } catch (err) {
            console.error("Data Fetch Error:", err);
            // Handle error quietly
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  return (
    <TeamLayout>
      <Head><title>Dashboard | Team Admin</title></Head>

      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Organization Overview</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs uppercase">{team.name}</p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Allocated Budget</div>
            <div className="text-xl font-bold font-mono text-[var(--text-main)]">₦0.00 <span className="text-xs font-normal text-[var(--text-muted)]">/mo</span></div>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricBlock label="Total Employees" value={team.members.length} sub="ACTIVE SEATS" icon={Users} />
        <MetricBlock label="Pending Invites" value="0" sub="AWAITING ACCEPTANCE" icon={Mail} />
        <MetricBlock label="Monthly Spend" value="₦0" sub="0% OF BUDGET" icon={CreditCard} />
        <MetricBlock label="Active Days" value="0" sub="THIS MONTH" icon={Calendar} />
      </div>

      {/* --- RECENT MEMBERS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Member List */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-color)]">
             <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold">Team Roster</h3>
                <button className="text-[10px] font-mono text-[var(--color-primary)] hover:underline">VIEW_ALL</button>
             </div>
             
             {team.members.length === 0 ? (
                 <div className="p-8 text-center text-[var(--text-muted)] font-mono text-xs">NO MEMBERS FOUND</div>
             ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase bg-[var(--bg-input)]">
                            <th className="p-4 font-normal">Employee</th>
                            <th className="p-4 font-normal">Email</th>
                            <th className="p-4 font-normal">Status</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                        {team.members.map((m, i) => (
                            <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors">
                                <td className="p-4 text-[var(--text-main)] font-bold">{m.username || 'User'}</td>
                                <td className="p-4 text-[var(--text-muted)]">{m.email}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-sm text-[10px] bg-green-500/10 text-green-600">
                                        ACTIVE
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             )}
          </div>

          {/* Budget Visualization (Empty State) */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6">
             <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold mb-4">Budget Utilization</h3>
             
             <div className="mb-6 relative h-40 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-[10px] border-[var(--bg-input)] flex items-center justify-center relative">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--text-main)]">0%</div>
                        <div className="text-[9px] text-[var(--text-muted)]">USED</div>
                    </div>
                </div>
             </div>
          </div>

      </div>
    </TeamLayout>
  );
}
