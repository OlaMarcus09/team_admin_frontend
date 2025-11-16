import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamLayout from '../../components/TeamLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Download, Zap, Sparkles, AlertTriangle } from 'lucide-react';

export default function TeamBilling() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const [userRes, teamRes, billingRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/team/dashboard/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/team/billing/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUser(userRes.data);
        setTeam(teamRes.data);
        setBillingData(billingRes.data);
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

  if (loading) {
    return (
      <TeamLayout activePage="billing" user={user} team={team}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading billing information...</p>
          </div>
        </div>
      </TeamLayout>
    );
  }

  const hasActiveSubscription = billingData?.subscription?.is_active;

  return (
    <TeamLayout activePage="billing" user={user} team={team}>
      <Head>
        <title>Team Billing | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-gray-400 text-sm">Manage your team's subscription and billing</p>
      </div>

      {/* --- Current Subscription --- */}
      <Card className={`border-0 ${
        hasActiveSubscription 
          ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20' 
          : 'bg-gradient-to-br from-gray-900 to-black border-gray-800'
      } mb-6`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Badge className={
                hasActiveSubscription 
                  ? 'bg-green-500/20 text-green-300 border-green-500/30 mb-2'
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-2'
              }>
                {hasActiveSubscription ? 'Active' : 'No Active Plan'}
              </Badge>
              <h3 className="font-bold text-white text-lg">
                {billingData?.subscription?.plan?.name || 'No Subscription'}
              </h3>
              <p className="text-gray-400 text-sm">
                {hasActiveSubscription ? 'Team Plan' : 'Setup required for team access'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-xl">
                {billingData?.subscription?.plan?.price_ngn ? `₦${billingData.subscription.plan.price_ngn}` : '₦0'}
              </p>
              <p className="text-gray-400 text-sm">per month</p>
            </div>
          </div>
          
          {hasActiveSubscription ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Next Billing</span>
                <span>{billingData.subscription.end_date || 'Dec 5, 2024'}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Team Members</span>
                <span>{team?.members?.length || 0} active</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Plan Access</span>
                <span>Standard + Premium</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-yellow-300 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Your team needs an active subscription</span>
              </div>
              <p className="text-gray-400 text-xs">
                Add a subscription to enable workspace access for your team members
              </p>
            </div>
          )}
          
          <Button className={`w-full mt-4 ${
            hasActiveSubscription 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}>
            {hasActiveSubscription ? 'Manage Subscription' : 'Add Subscription'}
          </Button>
        </CardContent>
      </Card>

      {/* --- Plan Features --- */}
      {hasActiveSubscription && (
        <Card className="border-0 bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Plan Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                '15 team member seats',
                '18 days per member/month',
                'Access to all standard spaces',
                'Premium space access',
                'High-speed WiFi at all locations',
                'Free coffee & tea',
                'Community events access',
                'Priority support'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Billing History --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Billing History
            </div>
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasActiveSubscription ? (
            <div className="space-y-3">
              {/* Sample billing history - you would map through real data */}
              {[
                { id: 1, date: 'Nov 5, 2024', amount: '₦45,000', status: 'Paid' },
                { id: 2, date: 'Oct 5, 2024', amount: '₦45,000', status: 'Paid' },
                { id: 3, date: 'Sep 5, 2024', amount: '₦45,000', status: 'Paid' },
              ].map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div>
                    <h4 className="text-white text-sm font-medium">Invoice #{invoice.id}</h4>
                    <p className="text-gray-400 text-xs">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{invoice.amount}</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">No Billing History</h3>
              <p className="text-gray-400 text-xs">
                Billing history will appear here once you have an active subscription
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Payment Method --- */}
      {hasActiveSubscription && (
        <Card className="border-0 bg-gray-900/50 border-gray-800 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white text-sm">Payment Method</h4>
              <Button variant="outline" size="sm" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                Update
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white text-sm">•••• •••• •••• 1234</p>
                <p className="text-gray-400 text-xs">Expires 12/26</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Support Info --- */}
      <Card className="border-0 bg-gray-900/50 border-gray-800 mt-6">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-2">Billing Support</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Invoices are generated on the 1st of each month</li>
                <li>• Payments are processed automatically</li>
                <li>• You can upgrade or downgrade your plan anytime</li>
                <li>• Contact support for billing questions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </TeamLayout>
  );
}
