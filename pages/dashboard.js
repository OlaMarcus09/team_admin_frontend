import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamAdminLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Dashboard() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/team/dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeam(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTeamInfo();
  }, []);

  return (
    <TeamAdminLayout activePage="dashboard">
      <Head>
        <title>Dashboard | Team Admin</title>
      </Head>
      <h1 className="text-3xl font-bold text-foreground">
        Welcome, {team?.name || 'Admin'}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Manage your team members and billing from one place.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading overview...</p>
          ) : (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{team?.members?.length || 0}</p>
              </div>
              <Button asChild>
                <Link href="/members">Manage Members</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
    </TeamAdminLayout>
  );
}
