import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import TeamLayout from '../components/Layout';
import { Users, Mail, CreditCard, Calendar, ArrowUpRight } from 'lucide-react';

const MetricBlock = ({ label, value, sub, icon: Icon, trend }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
    <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[var(--bg-input)] rounded-sm text-[var(--color-primary)]">
            <Icon className="w-5 h-5" />
        </div>
        {trend && (
            <div className="flex items-center text-green-500 text-[10px] font-mono">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {trend}
            </div>
        )}
    </div>
    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-mono font-bold text-[var(--text-main)] mb-1">{value}</div>
    <div className="text-xs text-[var(--text-muted)] font-mono">{sub}</div>
  </div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setTimeout(() => {
        setMembers([
            { id: 1, name: "Alice Cooper", email: "alice@microsoft.com", status: "ACTIVE" },
            { id: 2, name: "Bob Smith", email: "bob@microsoft.com", status: "PENDING" },
            { id: 3, name: "Charlie D.", email: "charlie@microsoft.com", status: "ACTIVE" },
        ]);
        setLoading(false);
    }, 1000);
  }, []);

  return (
    <TeamLayout>
      <Head><title>Dashboard | Team Admin</title></Head>

      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Organization Overview</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">MICROSOFT LAGOS TEAM [ID: MS-LA-99]</p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Allocated Budget</div>
            <div className="text-xl font-bold font-mono text-[var(--text-main)]">₦2,500,000 <span className="text-xs font-normal text-[var(--text-muted)]">/mo</span></div>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricBlock label="Total Employees" value="48" sub="ACTIVE SEATS" icon={Users} trend="+2" />
        <MetricBlock label="Pending Invites" value="5" sub="AWAITING ACCEPTANCE" icon={Mail} />
        <MetricBlock label="Monthly Spend" value="₦850k" sub="34% OF BUDGET" icon={CreditCard} />
        <MetricBlock label="Active Days" value="142" sub="THIS MONTH" icon={Calendar} trend="+12%" />
      </div>

      {/* --- RECENT MEMBERS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Member List */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-color)]">
             <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold">Team Roster</h3>
                <button className="text-[10px] font-mono text-[var(--color-primary)] hover:underline">VIEW_ALL</button>
             </div>
             <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase bg-[var(--bg-input)]">
                        <th className="p-4 font-normal">Employee</th>
                        <th className="p-4 font-normal">Email</th>
                        <th className="p-4 font-normal">Status</th>
                    </tr>
                </thead>
                <tbody className="font-mono text-xs">
                    {members.map((m) => (
                        <tr key={m.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors">
                            <td className="p-4 text-[var(--text-main)] font-bold">{m.name}</td>
                            <td className="p-4 text-[var(--text-muted)]">{m.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-sm text-[10px] ${m.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                    {m.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>

          {/* Budget Visualization */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6">
             <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold mb-4">Budget Utilization</h3>
             
             <div className="mb-6 relative h-40 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-[10px] border-[var(--bg-input)] flex items-center justify-center relative">
                    {/* Simple css chart trick */}
                    <div className="absolute inset-0 rounded-full border-[10px] border-[var(--color-primary)] border-l-transparent border-b-transparent rotate-45"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--text-main)]">34%</div>
                        <div className="text-[9px] text-[var(--text-muted)]">USED</div>
                    </div>
                </div>
             </div>

             <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[var(--text-muted)]">
                    <span>SPENT</span>
                    <span className="text-[var(--text-main)]">₦850,000</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                    <span>REMAINING</span>
                    <span className="text-[var(--text-main)]">₦1,650,000</span>
                </div>
             </div>
          </div>

      </div>
    </TeamLayout>
  );
}
