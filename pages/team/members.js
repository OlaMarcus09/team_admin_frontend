import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamLayout from '../../components/TeamLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Mail, UserPlus, Trash2, Clock, Sparkles, CheckCircle, XCircle } from 'lucide-react';

export default function TeamMembers() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const [userRes, teamRes, membersRes, invitesRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/team/dashboard/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/team/members/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/team/invites/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUser(userRes.data);
        setTeam(teamRes.data);
        setMembers(membersRes.data);
        setInvitations(invitesRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendInvitation = async () => {
    if (!inviteEmail) return;
    
    setSendingInvite(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_URL}/api/team/invites/`, {
        email: inviteEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInvitations(prev => [response.data, ...prev]);
      setInviteEmail('');
      // You might want to show a success message here
    } catch (error) {
      console.error('Error sending invitation:', error);
      // You might want to show an error message here
    } finally {
      setSendingInvite(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/api/team/members/${memberId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleRevokeInvitation = async (inviteId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/api/team/invites/${inviteId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInvitations(prev => prev.filter(invite => invite.id !== inviteId));
    } catch (error) {
      console.error('Error revoking invitation:', error);
    }
  };

  if (loading) {
    return (
      <TeamLayout activePage="members" user={user} team={team}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading team members...</p>
          </div>
        </div>
      </TeamLayout>
    );
  }

  return (
    <TeamLayout activePage="members" user={user} team={team}>
      <Head>
        <title>Team Members | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Team Members</h1>
        <p className="text-gray-400 text-sm">Manage your team members and invitations</p>
      </div>

      {/* --- Invite New Member --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-green-400" />
            Invite New Member
          </CardTitle>
          <CardDescription className="text-gray-400">
            Send an invitation to join your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Button 
              onClick={handleSendInvitation}
              disabled={sendingInvite || !inviteEmail}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {sendingInvite ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invite
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Active Members --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Active Members ({members.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {member.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">{member.username}</h4>
                      <p className="text-gray-400 text-xs">{member.email}</p>
                    </div>
                  </div>
                  
                  {member.id !== user?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">No Team Members</h3>
              <p className="text-gray-400 text-xs">
                Invite members to build your team
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Pending Invitations --- */}
      {invitations.filter(inv => inv.status === 'PENDING').length > 0 && (
        <Card className="border-0 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              Pending Invitations ({invitations.filter(inv => inv.status === 'PENDING').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.filter(inv => inv.status === 'PENDING').map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">{invitation.email}</h4>
                      <p className="text-gray-400 text-xs">
                        Invited by {invitation.sent_by} • {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeInvitation(invitation.id)}
                    className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Quick Tips --- */}
      <Card className="border-0 bg-gray-900/50 border-gray-800 mt-6">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-2">Team Management Tips</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Invited members will receive an email to join your team</li>
                <li>• Team members get immediate access to workspace benefits</li>
                <li>• You can remove members at any time</li>
                <li>• Pending invitations expire after 7 days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </TeamLayout>
  );
}
