import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import TeamAdminLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/team/billing/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBillingInfo(response.data);
      } catch (err)
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBillingInfo();
  }, []);

  return (
    <TeamAdminLayout activePage="billing">
      <Head>
        <title>Billing | Team Admin</title>
      </Head>
      <h1 className="text-3xl font-bold text-foreground">
        Billing
      </h1>
      
      <Card className="p-2 mt-8 max-w-lg">
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading billing...</p>
          ) : billingInfo?.subscription ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                {billingInfo.subscription.plan.name}
              </h2>
              <p className="text-4xl font-bold text-primary">
                ₦{Number(billingInfo.subscription.plan.price_ngn).toLocaleString()}
                <span className="text-lg font-medium text-muted-foreground"> / month</span>
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                  {billingInfo.subscription.plan.included_days} days per member
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                  Access to {billingInfo.subscription.plan.access_tier} Spaces
                </li>
              </ul>
            </div>
          ) : (
            <p>You do not have an active subscription for your team.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button disabled={true}>Change Plan (Coming Soon)</Button>
        </CardFooter>
      </Card>
    </TeamAdminLayout>
  );
}

// Helper Icon
const CheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
