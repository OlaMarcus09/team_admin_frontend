import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamAdminLayout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Trash2, AlertCircle, Mail, Users, PlusCircle } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasTeam, setHasTeam] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { Router.push('/'); return; }
    
    setLoading(true);
    setError('');
    setHasTeam(true);
    
    try {
      // First, check if user has a team by trying to get team data
      const teamCheck = await axios.get(`${API_URL}/api/team/dashboard/`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // If we get here, user has a team - fetch members and invites
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
      if (err.response?.status === 401) {
        localStorage.clear();
        Router.push('/');
      } else if (err.response?.status === 403) {
        setHasTeam(false);
        setError('no_team');
      } else {
        setError('Could not load team data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/api/team/invites/`, 
        { email: newInviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewInviteEmail('');
      setSuccess('Invitation sent successfully!');
      fetchData(); // Refresh lists
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You need a team to send invitations. Please contact support.');
      } else {
        setError(err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to send invitation.');
      }
    }
  };

  const handleRemoveMember = async (id) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) return;
    
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/api/team/members/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Member removed successfully!');
      fetchData(); // Refresh lists
    } catch (err) {
      setError('Failed to remove member.');
    }
  };
  
  const handleRevokeInvite = async (id) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;
    
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/api/team/invites/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Invitation revoked!');
      fetchData(); // Refresh lists
    } catch (err) {
      setError('Failed to revoke invitation.');
    }
  };

  const pendingInvites = invites?.filter(invite => invite.status === 'PENDING') || [];

  // No team assigned - show setup message
  if (!hasTeam) {
    return (
      <TeamAdminLayout activePage="members">
        <Head>
          <title>Member Management | Team Admin</title>
        </Head>
        
        <div className="text-center py-12">
          <PlusCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Team Setup Required</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You need a team assigned to your account to manage members.
          </p>
          <div className="space-y-4">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Please contact support to get your team set up.
              </AlertDescription>
            </Alert>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Check Again
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard">Back to Dashboard</a>
              </Button>
            </div>
          </div>
        </div>
      </TeamAdminLayout>
    );
  }

  return (
    <TeamAdminLayout activePage="members">
      <Head>
        <title>Member Management | Team Admin</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Member Management
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-2" /> Invite Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email-invite">Email Address</Label>
                <Input
                  id="email-invite"
                  type="email"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  placeholder="new_employee@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Invitation</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {error && error !== 'no_team' && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Active Members */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Active Team Members</CardTitle>
          <CardDescription>Members who have joined your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading members...</p>
            ) : members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active team members yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Invite team members to get started
                </p>
              </div>
            ) : (
              members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.photo_url} />
                      <AvatarFallback>
                        {member.username?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{member.username || member.email}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={member.id === 1} // Don't allow removing yourself
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Invitations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Invitations waiting to be accepted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading invites...</p>
            ) : pendingInvites.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending invitations</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Send invitations to add new team members
                </p>
              </div>
            ) : (
              pendingInvites.map(invite => (
                <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{invite.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Sent {new Date(invite.created_at).toLocaleDateString()} • Status: {invite.status}
                    </p>
                    {invite.sent_by && (
                      <p className="text-xs text-muted-foreground">
                        Invited by: {invite.sent_by}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRevokeInvite(invite.id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Need Help?</CardTitle>
          <CardDescription className="text-blue-700">
            Get assistance with team management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-blue-800">
            <p className="text-sm">
              • Team members will receive an email invitation to join
            </p>
            <p className="text-sm">
              • Invitations expire after 7 days if not accepted
            </p>
            <p className="text-sm">
              • Contact support for help with team setup or billing
            </p>
          </div>
        </CardContent>
      </Card>
    </TeamAdminLayout>
  );
}
