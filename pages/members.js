import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import TeamLayout from '../components/Layout';
import { UserPlus, Search } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            // Assuming you have an endpoint for team members
            const res = await axios.get(`${API_URL}/api/team/members/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(res.data);
        } catch (err) {
            console.error("Fetch Error", err);
        }
    };
    fetchMembers();
  }, []);

  return (
    <TeamLayout>
      <Head><title>Employees | Team Admin</title></Head>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Team Roster</h1>
        <button className="flex items-center px-6 py-3 bg-[var(--color-primary)] text-white font-mono text-xs font-bold uppercase hover:opacity-90">
            <UserPlus className="w-4 h-4 mr-2" /> Invite
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)]">
        <table className="w-full text-left">
            <thead>
                <tr className="text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase bg-[var(--bg-input)]">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                </tr>
            </thead>
            <tbody className="font-mono text-xs">
                {members.length === 0 ? (
                    <tr><td colSpan="3" className="p-4 text-center text-[var(--text-muted)]">NO MEMBERS FOUND</td></tr>
                ) : members.map((m, i) => (
                    <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)]">
                        <td className="p-4 text-[var(--text-main)] font-bold">{m.username}</td>
                        <td className="p-4 text-[var(--text-muted)]">{m.email}</td>
                        <td className="p-4"><span className="text-green-500">ACTIVE</span></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </TeamLayout>
  );
}
