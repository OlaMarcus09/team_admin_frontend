import React, { useState } from 'react';
import Head from 'next/head';
import TeamLayout from '../components/Layout';
import { UserPlus, MoreHorizontal, Search } from 'lucide-react';

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const members = [
      { id: 1, name: "Alice Cooper", email: "alice@microsoft.com", role: "Developer", status: "ACTIVE", spent: "₦45,000" },
      { id: 2, name: "Bob Smith", email: "bob@microsoft.com", role: "Designer", status: "PENDING", spent: "₦0" },
      { id: 3, name: "Charlie D.", email: "charlie@microsoft.com", role: "Manager", status: "ACTIVE", spent: "₦90,000" },
      { id: 4, name: "Diana Prince", email: "diana@microsoft.com", role: "DevOps", status: "ACTIVE", spent: "₦22,500" },
  ];

  return (
    <TeamLayout>
      <Head><title>Employees | Team Admin</title></Head>

      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Team Management</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">MANAGE ACCESS & ROLES</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-[var(--color-primary)] text-white font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
            <UserPlus className="w-4 h-4 mr-2" /> Invite_Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input 
            type="text" 
            placeholder="SEARCH_EMPLOYEE_ID..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Members Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)]">
        <table className="w-full text-left">
            <thead>
                <tr className="text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase bg-[var(--bg-input)]">
                    <th className="p-4 font-normal">Employee Name</th>
                    <th className="p-4 font-normal">Email</th>
                    <th className="p-4 font-normal">Role</th>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal text-right">Monthly Spend</th>
                    <th className="p-4 font-normal text-center">Action</th>
                </tr>
            </thead>
            <tbody className="font-mono text-xs">
                {members.map((m) => (
                    <tr key={m.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors">
                        <td className="p-4 text-[var(--text-main)] font-bold">{m.name}</td>
                        <td className="p-4 text-[var(--text-muted)]">{m.email}</td>
                        <td className="p-4 text-[var(--text-main)]">{m.role}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-sm text-[10px] ${m.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                {m.status}
                            </span>
                        </td>
                        <td className="p-4 text-right text-[var(--text-main)]">{m.spent}</td>
                        <td className="p-4 text-center">
                            <button className="text-[var(--text-muted)] hover:text-[var(--color-primary)]">
                                <MoreHorizontal className="w-4 h-4 mx-auto" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </TeamLayout>
  );
}
