import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import TeamAdminLayout from '../components/Layout';

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          Router.push('/');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/team/billing/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setBillingInfo(response.data);
      } catch (err) {
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
      <h1 className="text-3xl font-bold text-neutral-800">
        Billing
      </h1>
      <p className="mt-2 text-lg text-neutral-600">
        View your team's current subscription.
      </p>
      
      <div className="p-8 mt-8 bg-white shadow-lg rounded-2xl max-w-lg">
        {loading ? (
          <p>Loading billing...</p>
        ) : billingInfo?.subscription ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-800">
              {billingInfo.subscription.plan.name}
            </h2>
            <p className="text-4xl font-bold text-teal-600">
              ₦{Number(billingInfo.subscription.plan.price_ngn).toLocaleString()}
              <span className="text-lg font-medium text-neutral-500"> / month</span>
            </p>
            <p className="text-neutral-600">
              <span className="font-bold">{billingInfo.subscription.plan.included_days} days</span> per member, per month
            </p>
            <p className="text-neutral-600">
              Access Tier: <span className="font-bold">{billingInfo.subscription.plan.access_tier}</span>
            </p>
            <p className="pt-4 text-sm text-neutral-500">
              Subscription is Active. (Next renewal: {billingInfo.subscription.end_date || 'N/A'})
            </p>
          </div>
        ) : (
          <p>You do not have an active subscription for your team.</p>
        )}
      </div>
    </TeamAdminLayout>
  );
}
