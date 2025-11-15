import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamAdminLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Calendar, Users, CheckCircle2, AlertCircle, Download, PlusCircle } from 'lucide-react';

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addingSubscription, setAddingSubscription] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchBillingInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { Router.push('/'); return; }

      const response = await axios.get(`${API_URL}/api/team/billing/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBillingInfo(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        Router.push('/');
      } else if (err.response?.status === 403) {
        setError('no_team');
      } else {
        setError('Failed to load billing information.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const handleAddSubscription = async () => {
    setAddingSubscription(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_URL}/api/team/add-subscription/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess('Subscription added successfully!');
      fetchBillingInfo(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add subscription.');
    } finally {
      setAddingSubscription(false);
    }
  };

  const CheckIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  // Mock billing history data
  const billingHistory = [
    { id: 1, invoice_number: 'INV-2024-001', date: '2024-11-01', amount: 75000, status: 'Paid' },
    { id: 2, invoice_number: 'INV-2024-002', date: '2024-10-01', amount: 75000, status: 'Paid' },
    { id: 3, invoice_number: 'INV-2024-003', date: '2024-09-01', amount: 75000, status: 'Paid' },
  ];

  if (error === 'no_team') {
    return (
      <TeamAdminLayout activePage="billing">
        <Head>
          <title>Billing | Team Admin</title>
        </Head>
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Team Setup Required</h2>
          <p className="text-muted-foreground mb-6">
            You need a team assigned to your account to view billing information.
          </p>
          <Button asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </TeamAdminLayout>
    );
  }

  const hasSubscription = billingInfo?.subscription;

  return (
    <TeamAdminLayout activePage="billing">
      <Head>
        <title>Billing & Subscription | Team Admin</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Billing & Subscription
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your team's subscription and payment information
          </p>
        </div>
      </div>

      {error && error !== 'no_team' && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-6 bg-green-50 border-green-200">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Current Subscription */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                {hasSubscription ? 'Your active team plan and features' : 'No active subscription'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <p className="text-muted-foreground">Loading subscription details...</p>
              ) : hasSubscription ? (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {billingInfo.subscription.plan?.name || 'Team Flex Pro'}
                      </h3>
                      <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">
                        ₦{Number(billingInfo.subscription.plan?.price_ngn || 75000).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Team Size</p>
                        <p className="text-sm text-muted-foreground">Up to 15 members</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Check-in Days</p>
                        <p className="text-sm text-muted-foreground">
                          {billingInfo.subscription.plan?.included_days || 15} days per member/month
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Plan Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                        <span>Access to Standard & Premium spaces</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                        <span>Flexible team member management</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                        <span>Centralized billing and invoicing</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                        <span>Usage analytics and reporting</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No active subscription</p>
                  <Button 
                    onClick={handleAddSubscription} 
                    disabled={addingSubscription}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {addingSubscription ? 'Adding Subscription...' : 'Add Team Flex Pro'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    ₦75,000/month • 15 days per member • Premium spaces
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Next billing date</p>
                  <p className="text-sm text-muted-foreground">
                    {hasSubscription ? 
                      new Date(billingInfo.subscription.end_date).toLocaleDateString() : 
                      'No active subscription'
                    }
                  </p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" disabled={!hasSubscription}>
                    Change Plan
                  </Button>
                  <Button variant="outline" disabled={!hasSubscription}>
                    Update Payment
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Billing History */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your team's payment records</CardDescription>
            </CardHeader>
            <CardContent>
              {billingHistory.length > 0 ? (
                <div className="space-y-4">
                  {billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          ₦{invoice.amount.toLocaleString()}
                        </p>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No billing history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Payment & Support */}
        <div className="space-y-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasSubscription ? (
                <>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">••••</span>
                      </div>
                      <div>
                        <p className="font-medium">Visa •••• 1234</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2024</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Update Payment Method
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Add a subscription to manage payment methods</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-blue-800">
                For billing questions or to change your plan, contact our support team.
              </p>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Plan changes</p>
                <p>• Billing issues</p>
                <p>• Invoice requests</p>
                <p>• Payment method updates</p>
              </div>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Seat Management */}
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {hasSubscription ? '15 seats available' : 'Add subscription to manage seats'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeamAdminLayout>
  );
}
