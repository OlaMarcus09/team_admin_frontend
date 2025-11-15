import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamAdminLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, TrendingUp, BarChart3, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');

  // Mock analytics data (to be replaced with real API)
  const mockAnalytics = {
    total_checkins: 87,
    active_members: 8,
    top_spaces: [
      { name: 'Tech Hub Ibadan', checkins: 23 },
      { name: 'Creative Space Lagos', checkins: 18 },
      { name: 'Business Center Abuja', checkins: 15 },
    ],
    monthly_trend: [
      { month: 'Sep', checkins: 65 },
      { month: 'Oct', checkins: 72 },
      { month: 'Nov', checkins: 87 },
    ],
    member_activity: [
      { name: 'John Doe', checkins: 12, last_active: '2 days ago' },
      { name: 'Jane Smith', checkins: 10, last_active: '1 day ago' },
      { name: 'Mike Johnson', checkins: 8, last_active: '3 days ago' },
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        // TODO: Replace with real API call
        // const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // const response = await axios.get(`${API_URL}/api/team/analytics/`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setAnalyticsData(response.data);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalyticsData(mockAnalytics);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <TeamAdminLayout activePage="analytics">
      <Head>
        <title>Analytics | Team Admin</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Team Analytics
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Insights into your team's workspace usage
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard
          title="Total Check-ins"
          value={loading ? '...' : analyticsData?.total_checkins || 0}
          subtitle={`This ${timeRange}`}
          icon={BarChart3}
          trend="+12% from last month"
        />
        <StatCard
          title="Active Members"
          value={loading ? '...' : analyticsData?.active_members || 0}
          subtitle="Used workspace this month"
          icon={Users}
          trend="+2 members"
        />
        <StatCard
          title="Average Usage"
          value={loading ? '...' : '10.9'}
          subtitle="Days per member"
          icon={TrendingUp}
          trend="+1.2 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Spaces */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Spaces</CardTitle>
            <CardDescription>Where your team checks in most often</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {analyticsData?.top_spaces?.map((space, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{space.name}</p>
                      <p className="text-sm text-muted-foreground">{space.checkins} check-ins</p>
                    </div>
                    <Badge variant="outline">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Member Activity</CardTitle>
            <CardDescription>Most active team members</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {analyticsData?.member_activity?.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.checkins} check-ins • Last active {member.last_active}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Trend */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Usage Trend</CardTitle>
          <CardDescription>Team check-ins over time</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading trend data...</p>
          ) : (
            <div className="space-y-4">
              {analyticsData?.monthly_trend?.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{month.month}</span>
                  <div className="flex items-center space-x-4 flex-1 max-w-md">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(month.checkins / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {month.checkins}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon Features */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Coming Soon</CardTitle>
          <CardDescription className="text-blue-700">
            Enhanced analytics features in development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <p className="font-medium mb-2">Planned Features:</p>
              <ul className="text-sm space-y-1">
                <li>• Real-time usage dashboards</li>
                <li>• Space utilization heatmaps</li>
                <li>• Cost optimization insights</li>
                <li>• Team productivity metrics</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Export Options:</p>
              <ul className="text-sm space-y-1">
                <li>• PDF reports</li>
                <li>• CSV data exports</li>
                <li>• Automated weekly emails</li>
                <li>• Custom date ranges</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </TeamAdminLayout>
  );
}
