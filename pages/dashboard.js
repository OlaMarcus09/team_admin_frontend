import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamAdminLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Mail, Calendar, CreditCard, ArrowUpRight, UserPlus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Dashboard() {
  const [teamData, setTeamData] = useState(null);
  const [invites, setInvites] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        // Fetch all data in parallel
        const [teamRes, invitesRes, billingRes] = await Promise.all([
          axios.get(`${API_URL}/api/team/dashboard/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }).catch(err => {
            if (err.response?.status === 403) {
              throw new Error('You do not have a team assigned. Please contact support.');
            }
            throw err;
          }),
          axios.get(`${API_URL}/api/team/invites/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/team/billing/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);

        setTeamData(teamRes.data);
        setInvites(invitesRes.data);
        setBilling(billingRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          Router.push('/');
        } else {
          setError(err.message || 'Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Calculate pending invites
  const pendingInvites = invites?.filter(invite => invite.status === 'PENDING') || [];

  if (error) {
    return (
      <TeamAdminLayout activePage="dashboard">
        <Head>
          <title>Dashboard | Team Admin</title>
        </Head>
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Please contact support to set up your team account.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </TeamAdminLayout>
    );
  }

  return (
    <TeamAdminLayout activePage="dashboard">
      <Head>
        <title>Dashboard | Team Admin</title>
      </Head>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {teamData?.name || 'Admin'}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Here's what's happening with your team today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/members">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/billing">
              <CreditCard className="w-4 h-4 mr-2" />
              View Billing
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard
          title="Total Team Members"
          value={teamData?.members?.length || 0}
          subtitle="Active team members"
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Pending Invitations"
          value={pendingInvites.length}
          subtitle="Awaiting acceptance"
          icon={Mail}
          color="amber"
        />
        <StatCard
          title="Current Plan"
          value={billing?.subscription?.plan?.name || 'No Plan'}
          subtitle={billing?.subscription ? 'Active subscription' : 'No subscription'}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Team Check-Ins"
          value="0"
          subtitle="This month"
          icon={Calendar}
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Current members of your team</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading members...</p>
          ) : teamData?.members?.length > 0 ? (
            <div className="space-y-4">
              {teamData.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">{member.username}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No team members yet</p>
              <Button asChild className="mt-4">
                <Link href="/members">Invite Your First Member</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TeamAdminLayout>
  );
}
