import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamLayout from '../../components/TeamLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Building, User, Shield, HelpCircle, Mail, Phone, LogOut } from 'lucide-react';

export default function TeamSettings() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('team');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
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

  const MenuItem = ({ icon, title, description, action, color = "gray" }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group">
      <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.clear();
    Router.push('/login');
  };

  if (loading) {
    return (
      <TeamLayout activePage="settings" user={user} team={team}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading settings...</p>
          </div>
        </div>
      </TeamLayout>
    );
  }

  return (
    <TeamLayout activePage="settings" user={user} team={team}>
      <Head>
        <title>Team Settings | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Team Settings</h1>
        <p className="text-gray-400 text-sm">Manage your team and account settings</p>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mt-4">
          {[
            { id: 'team', label: 'Team Info' },
            { id: 'account', label: 'Account' },
            { id: 'support', label: 'Support' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* --- Team Info Tab --- */}
      {activeTab === 'team' && team && (
        <div className="space-y-6">
          {/* Team Details */}
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-400" />
                Team Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Team Name</label>
                  <Input 
                    value={team.name} 
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Admin Email</label>
                  <Input 
                    value={user?.email} 
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Team Members</label>
                  <div className="mt-1">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {team.members?.length || 0} active members
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Usage */}
          <Card className="border-0 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Team Usage</CardTitle>
              <CardDescription className="text-gray-400">
                Current team activity and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Members</span>
                  <span className="text-white">{team.members?.length || 0}/15</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${((team.members?.length || 0) / 15) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm mt-4">
                  <span className="text-gray-400">Monthly Check-ins</span>
                  <span className="text-white">0/270</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Actions */}
          <Card className="border-0 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Team Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-blue-500 text-blue-300 hover:bg-blue-500/10">
                  Export Team Data
                </Button>
                <Button variant="outline" className="w-full border-yellow-500 text-yellow-300 hover:bg-yellow-500/10">
                  Transfer Ownership
                </Button>
                <Button variant="outline" className="w-full border-red-500 text-red-300 hover:bg-red-500/10">
                  Delete Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Account Tab --- */}
      {activeTab === 'account' && (
        <div className="space-y-4">
          <MenuItem
            icon={<User className="w-5 h-5" />}
            title="Personal Information"
            description="Update your profile details"
            color="blue"
          />
          <MenuItem
            icon={<Shield className="w-5 h-5" />}
            title="Security & Privacy"
            description="Manage password and security settings"
            color="purple"
          />
          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            title="Preferences"
            description="Customize your team admin experience"
            color="green"
          />
          <MenuItem
            icon={<Phone className="w-5 h-5" />}
            title="Contact Information"
            description="Update phone and contact details"
            color="yellow"
          />
        </div>
      )}

      {/* --- Support Tab --- */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <MenuItem
            icon={<HelpCircle className="w-5 h-5" />}
            title="Help & Support"
            description="Get help and contact support"
            color="blue"
          />
          <MenuItem
            icon={<Mail className="w-5 h-5" />}
            title="Contact Support"
            description="Reach out to our team"
            color="purple"
          />
          <Card className="border-0 bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-white text-sm mb-2">Team Admin Resources</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Team Management Guide</li>
                <li>• Billing & Subscription FAQ</li>
                <li>• Member Onboarding Checklist</li>
                <li>• Admin Best Practices</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Logout Button --- */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <Button 
          variant="outline" 
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </TeamLayout>
  );
}
