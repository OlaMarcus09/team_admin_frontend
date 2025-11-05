import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import TeamAdminLayout from '../components/Layout';

export default function Dashboard() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          Router.push('/');
          return;
        }

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

  if (loading) {
    return (
      <TeamAdminLayout activePage="dashboard">
        <h1 className="text-3xl font-bold text-neutral-800">
          Loading dashboard...
        </h1>
      </TeamAdminLayout>
    );
  }

  return (
    <TeamAdminLayout activePage="dashboard">
      <h1 className="text-3xl font-bold text-neutral-800">
        Welcome, {team?.name || 'Admin'}
      </h1>
      <p className="mt-2 text-lg text-neutral-600">
        This is your central dashboard. You can manage your team members and view your subscription billing from the links on the left.
      </p>
    </TeamAdminLayout>
  );
}
