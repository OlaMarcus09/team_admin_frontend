import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import TeamAdminLayout from '../components/Layout';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // --- 1. Fetch all data on load ---
  const fetchData = async () => {
    if (!token) Router.push('/');
    setLoading(true);
    
    try {
      // Parallel requests
      const [membersRes, invitesRes] = await Promise.all([
        axios.get(`${API_URL}/api/team/members/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/team/invites/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setMembers(membersRes.data);
      setInvites(invitesRes.data);
      
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        Router.push('/');
      } else {
        setError('Could not load members.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. Invite a new member ---
  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post(`${API_URL}/api/team/invites/`, 
        { email: newInviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewInviteEmail('');
      fetchData(); // Refresh lists
      
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Failed to send invite.');
    }
  };

  // --- 3. Remove a member ---
  const handleRemoveMember = async (id) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/team/members/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh lists
    } catch (err) {
      setError('Failed to remove member.');
    }
  };
  
  // --- 4. Revoke an invite ---
  const handleRevokeInvite = async (id) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;

    try {
      await axios.delete(`${API_URL}/api/team/invites/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh lists
    } catch (err) {
      setError('Failed to revoke invite.');
    }
  };

  return (
    <TeamAdminLayout activePage="members">
      <h1 className="text-3xl font-bold text-neutral-800">
        Member Management
      </h1>
      
      {error && <p className="my-2 text-red-600">{error}</p>}

      {/* --- Invite Form --- */}
      <form onSubmit={handleInvite} className="p-8 mt-8 bg-white shadow-lg rounded-2xl max-w-lg">
        <h2 className="text-2xl font-bold text-neutral-800">Invite New Member</h2>
        <p className="mt-1 text-neutral-600">Enter the email of the member you want to invite.</p>
        <div className="flex mt-4 space-x-2">
          <input
            type="email"
            value={newInviteEmail}
            onChange={(e) => setNewInviteEmail(e.target.value)}
            placeholder="new_employee@example.com"
            required
            className="w-full px-4 py-3 text-neutral-800 bg-neutral-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-6 py-3 font-bold text-white transition-all bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            Send Invite
          </button>
        </div>
      </form>

      {/* --- Active Members List --- */}
      <div className="p-8 mt-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-neutral-800">Active Team Members</h2>
        <div className="mt-4 space-y-3">
          {loading ? <p>Loading members...</p> : members.length === 0 ? <p>You have no active team members.</p> : null}
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium text-neutral-800">{member.username}</p>
                <p className="text-sm text-neutral-500">{member.email}</p>
              </div>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* --- Pending Invites List --- */}
      <div className="p-8 mt-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-neutral-800">Pending Invitations</h2>
        <div className="mt-4 space-y-3">
          {loading ? <p>Loading invites...</p> : invites.length === 0 ? <p>You have no pending invites.</p> : null}
          {invites.map(invite => (
            <div key={invite.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium text-neutral-800">{invite.email}</p>
                <p className="text-sm text-neutral-500">Status: {invite.status}</p>
              </div>
              <button
                onClick={() => handleRevokeInvite(invite.id)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>
      
    </TeamAdminLayout>
  );
}
