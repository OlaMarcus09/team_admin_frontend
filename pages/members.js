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
import { UserPlus, Trash2, AlertCircle } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const fetchData = async () => {
    if (!token) Router.push('/');
    setLoading(true);
    try {
      const [membersRes, invitesRes] = await Promise.all([
        axios.get(`${API_URL}/api/team/members/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/team/invites/`, { headers: { Authorization: `Bearer ${token}` } })
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
              <Button type="submit" className="w-full">Send Invite</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* --- Active Members List --- */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Active Team Members</CardTitle>
          <CardDescription>Members who have accepted their invite and can use the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <p className="text-muted-foreground">Loading members...</p> : members.length === 0 ? <p className="text-muted-foreground">You have no active team members.</p> : null}
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.photo_url} />
                    <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{member.username}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(member.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* --- Pending Invites List --- */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Invites you have sent that have not been accepted yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <p className="text-muted-foreground">Loading invites...</p> : invites.length === 0 ? <p className="text-muted-foreground">You have no pending invites.</p> : null}
            {invites.map(invite => (
              <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{invite.email}</p>
                  <p className="text-sm text-muted-foreground">Status: {invite.status}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRevokeInvite(invite.id)}>
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
    </TeamAdminLayout>
  );
}
