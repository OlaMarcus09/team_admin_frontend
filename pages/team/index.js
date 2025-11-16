import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamLayout from '../../components/TeamLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Calendar, TrendingUp, Zap, Sparkles, ArrowRight, UserPlus } from 'lucide-react';

export default function TeamDashboard() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Get dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { 
          Router.push('/login'); 
          return; 
        }

        const [userRes, teamRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/team/dashboard/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUser(userRes.data);
        setTeam(teamRes.data);
        
        // Create dashboard data from team response
        if (teamRes.data) {
          setDashboardData({
            totalMembers: teamRes.data.members?.length || 0,
            pendingInvitations: teamRes.data.invitations?.filter(inv => inv.status === 'PENDING').length || 0,
            teamCheckins: 0, // We'll need to calculate this from check-ins
            planName: teamRes.data.subscription?.plan?.name || 'No Plan'
          });
        }
      } catch (err) {
        console.error('Error fetching team data:', err);
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

  const StatCard = ({ title, value, subtitle, icon, color = "purple", trend }) => (
    <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center text-${color}-400`}>
            {icon}
          </div>
          {trend && (
            <Badge className={`${trend > 0 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'} text-xs`}>
              {trend > 0 ? '+' : ''}{trend}%
            </Badge>
          )}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const QuickAction = ({ icon, title, description, action, color = "blue" }) => (
    <Card 
      className="border-0 bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer active:scale-95"
      onClick={() => Router.push(action)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
            <p className="text-gray-400 text-xs">{description}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <TeamLayout activePage="dashboard" user={null} team={null}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </TeamLayout>
    );
  }

  return (
    <TeamLayout activePage="dashboard" user={user} team={team}>
      <Head>
        <title>Team Dashboard | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getGreeting()}, {user?.username || 'Admin'}! 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage your team and workspace access</p>
          </div>
        </div>
      </div>

      {/* --- Quick Stats --- */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="Team Members"
          value={dashboardData?.totalMembers || 0}
          subtitle="Active members"
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Pending Invites"
          value={dashboardData?.pendingInvitations || 0}
          subtitle="Awaiting response"
          icon={<Mail className="w-6 h-6" />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="Monthly Check-ins"
          value={dashboardData?.teamCheckins || 0}
          subtitle="Team usage"
          icon={<Calendar className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Current Plan"
          value={dashboardData?.planName || 'None'}
          subtitle="Subscription"
          icon={<TrendingUp className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* --- Quick Actions --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <QuickAction
            icon={<UserPlus className="w-5 h-5" />}
            title="Invite Members"
            description="Add new members to your team"
            action="/team/members"
            color="purple"
          />
          <QuickAction
            icon={<Users className="w-5 h-5" />}
            title="Manage Team"
            description="View and manage team members"
            action="/team/members"
            color="blue"
          />
          <QuickAction
            icon={<CreditCard className="w-5 h-5" />}
            title="Billing & Plan"
            description="View subscription and billing"
            action="/team/billing"
            color="green"
          />
        </div>
      </div>

      {/* --- Recent Activity --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Team Activity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Recent team member activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData?.totalMembers > 0 ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-gray-400 text-sm">
                  {dashboardData.totalMembers} active team members
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-purple-500 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => Router.push('/team/members')}
                >
                  Manage Team
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">No Team Members Yet</h3>
                <p className="text-gray-400 text-xs mb-4">
                  Start by inviting members to join your team
                </p>
                <Button 
                  onClick={() => Router.push('/team/members')}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                >
                  Invite First Member
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- Team Plan Status --- */}
      <Card className="border-0 bg-gray-900/50 border-gray-800 mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Team Status</p>
              <p className="text-white font-semibold">
                {dashboardData?.planName === 'No Plan' ? 'No Active Plan' : 'Plan Active'}
              </p>
            </div>
            <Badge className={
              dashboardData?.planName === 'No Plan' 
                ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                : 'bg-green-500/20 text-green-300 border-green-500/30'
            }>
              {dashboardData?.planName === 'No Plan' ? 'Setup Required' : 'Active'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </TeamLayout>
  );
}
