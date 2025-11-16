import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Wifi, Coffee, Users, Clock, QrCode, TrendingUp, Calendar, Search, Zap, Sparkles, ArrowRight, Building2, BarChart3 } from 'lucide-react';

// This component will handle redirection based on user type
function UserTypeRedirect() {
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { 
          Router.push('/login'); 
          return; 
        }

        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        const user = userRes.data;
        
        // Redirect partners to partner dashboard
        if (user.user_type === 'PARTNER') {
          Router.push('/partner');
          return;
        }
        
        // Team admins and members would go to their respective portals
        if (user.user_type === 'TEAM_ADMIN' || user.user_type === 'TEAM_MEMBER') {
          // For team admins, redirect to team dashboard
          if (user.user_type === 'TEAM_ADMIN') {
            Router.push('/team');
            return;
          }
          // For team members, they stay on subscriber app for now
          // We could build a team member portal later
        }
        
        // Subscribers stay on the subscriber app
        // No redirect needed
        
      } catch (err) {
        console.error('Error checking user type:', err);
        // If there's an error, stay on current page
      }
    };
    
    checkUserType();
  }, []);

  return null;
}

export default function AppHome() {
  const [spaces, setSpaces] = useState([]);
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    checkins: 0, 
    daysLeft: 18, // Flex Pro has 18 days
    monthlyUsage: '0/18 days'
  });

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

        const [userRes, spacesRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/spaces/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);
        
        setUser(userRes.data);
        setSpaces(spacesRes.data); // Show all 7 spaces
        
        // For now, set analytics to zero since no check-ins yet
        setAnalytics({
          overview: {
            total_checkins: 0,
            monthly_checkins: 0,
            days_used: 0,
            favorite_space: 'None',
            member_since: userRes.data.date_joined || 'Just now'
          },
          subscription: {
            plan_name: 'Flex Pro',
            total_days: 18,
            days_used: 0,
            days_remaining: 18,
            access_tier: 'PREMIUM'
          }
        });
        
      } catch (err) {
        console.error('Error fetching data:', err);
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

  const QuickAction = ({ icon, title, description, action, color = "blue" }) => {
    const handleClick = () => {
      Router.push(action);
    };

    return (
      <Card 
        className="border-0 bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer active:scale-95"
        onClick={handleClick}
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
  };

  const SpaceCard = ({ space }) => (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group active:scale-95">
      <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-3">
          <Badge className={`${space.access_tier === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'} border backdrop-blur-sm text-xs`}>
            {space.access_tier === 'PREMIUM' ? '⭐ Premium' : '✨ Standard'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-bold text-white text-sm mb-1 group-hover:text-purple-300 transition-colors line-clamp-1">{space.name}</h3>
        
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <MapPin className="w-3 h-3 mr-1 text-purple-400" />
          <span className="line-clamp-1">{space.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <Wifi className="w-3 h-3 mr-1 text-green-400" />
            </div>
            <div className="flex items-center">
              <Coffee className="w-3 h-3 mr-1 text-orange-400" />
            </div>
          </div>
          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
            Available
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const usagePercentage = analytics?.subscription ? 
    (analytics.overview.days_used / analytics.subscription.total_days) * 100 : 0;

  return (
    <>
      <UserTypeRedirect />
      <AppLayout activePage="home">
        <Head>
          <title>Dashboard | Workspace Africa</title>
        </Head>

        {/* --- Modern Header --- */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {getGreeting()}, {user?.username || 'there'}! 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">Ready to find your perfect workspace today?</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search spaces, locations..."
              className="pl-10 h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* --- Quick Stats --- */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-purple-300 font-medium">Monthly Check-ins</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">18</div>
              <div className="text-xs text-blue-300 font-medium">Days Left</div>
            </CardContent>
          </Card>
        </div>

        {/* --- Quick Actions --- */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Quick Actions</h2>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <QuickAction
              icon={<QrCode className="w-5 h-5" />}
              title="Show Check-In Key"
              description="Generate your digital access code"
              action="/checkin"
              color="purple"
            />
            <QuickAction
              icon={<Building2 className="w-5 h-5" />}
              title="Browse Spaces"
              description="Find workspaces near you"
              action="/spaces"
              color="blue"
            />
            <QuickAction
              icon={<BarChart3 className="w-5 h-5" />}
              title="View Analytics"
              description="Track your usage patterns"
              action="/analytics"
              color="green"
            />
            <QuickAction
              icon={<Calendar className="w-5 h-5" />}
              title="My Plan & Usage"
              description="View subscription details"
              action="/profile"
              color="yellow"
            />
          </div>
        </div>

        {/* --- Available Spaces --- */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Available Spaces</h2>
            <Button variant="ghost" size="sm" asChild className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 text-sm">
              <a href="/spaces">See All ({spaces.length})</a>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="animate-pulse border-0 bg-gray-900">
                  <div className="aspect-video bg-gray-800 rounded-lg"></div>
                  <CardContent className="p-3 space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-800 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {spaces.slice(0, 4).map(space => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          )}
        </div>

        {/* --- Usage Stats --- */}
        <Card className="border-0 bg-gradient-to-r from-gray-900 to-black border border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-sm">Monthly Usage</h3>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                0/18 days
              </Badge>
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '0%' }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>0 days used</span>
              <span>18 days remaining</span>
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    </>
  );
}
