import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamAdminLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [teamInfo, setTeamInfo] = useState({
    company_name: '',
    admin_email: '',
    admin_phone: ''
  });
  const [notifications, setNotifications] = useState({
    member_joins: true,
    billing_fails: true,
    monthly_reports: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // Mock data for now - replace with actual API call
        setTeamInfo({
          company_name: 'Acme Corporation',
          admin_email: 'admin@acme.com',
          admin_phone: '+2348012345678'
        });
      } catch (err) {
        console.error('Failed to fetch team info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamInfo();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Settings updated successfully!');
    } catch (err) {
      setMessage('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    // Implement password change flow
    alert('Password change feature coming soon!');
  };

  return (
    <TeamAdminLayout activePage="settings">
      <Head>
        <title>Settings | Team Admin</title>
      </Head>
      
      <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Manage your team settings and preferences
      </p>

      {message && (
        <Alert className={`mt-4 ${message.includes('successfully') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {message.includes('successfully') ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSaveSettings}>
        {/* Company Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Your company details and admin contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={teamInfo.company_name}
                  onChange={(e) => setTeamInfo({...teamInfo, company_name: e.target.value})}
                  placeholder="Your company name"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="admin_email">Admin Email</Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={teamInfo.admin_email}
                  onChange={(e) => setTeamInfo({...teamInfo, admin_email: e.target.value})}
                  placeholder="admin@company.com"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="admin_phone">Admin Phone</Label>
                <Input
                  id="admin_phone"
                  value={teamInfo.admin_phone}
                  onChange={(e) => setTeamInfo({...teamInfo, admin_phone: e.target.value})}
                  placeholder="+2348012345678"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose which email notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="member_joins" className="text-base font-medium">Member Joins</Label>
                <p className="text-sm text-muted-foreground">Email me when a new member joins the team</p>
              </div>
              <input
                type="checkbox"
                id="member_joins"
                checked={notifications.member_joins}
                onChange={(e) => setNotifications({...notifications, member_joins: e.target.checked})}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="billing_fails" className="text-base font-medium">Billing Issues</Label>
                <p className="text-sm text-muted-foreground">Email me when billing fails</p>
              </div>
              <input
                type="checkbox"
                id="billing_fails"
                checked={notifications.billing_fails}
                onChange={(e) => setNotifications({...notifications, billing_fails: e.target.checked})}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthly_reports" className="text-base font-medium">Monthly Reports</Label>
                <p className="text-sm text-muted-foreground">Send me monthly usage reports</p>
              </div>
              <input
                type="checkbox"
                id="monthly_reports"
                checked={notifications.monthly_reports}
                onChange={(e) => setNotifications({...notifications, monthly_reports: e.target.checked})}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button type="button" variant="outline" onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>
      </form>
    </TeamAdminLayout>
  );
}
