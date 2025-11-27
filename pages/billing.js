import React from 'react';
import Head from 'next/head';
import TeamLayout from '../components/Layout';
import { Download, CreditCard } from 'lucide-react';

export default function BillingPage() {
  return (
    <TeamLayout>
      <Head><title>Billing | Team Admin</title></Head>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Corporate Billing</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">INVOICES & PAYMENT METHODS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 bg-[var(--color-primary)] text-white text-[10px] font-mono uppercase">Active</div>
             <div className="text-[var(--color-primary)] font-mono text-xs uppercase mb-2">Current Subscription</div>
             <div className="text-3xl font-bold text-[var(--text-main)] mb-4">ENTERPRISE_V1</div>
             <div className="text-sm text-[var(--text-muted)] mb-6">Unlimited Seats • Monthly Billing</div>
          </div>
      </div>

      <div className="mt-8 bg-[var(--bg-surface)] border border-[var(--border-color)]">
         <div className="p-4 border-b border-[var(--border-color)]">
            <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold">Invoice History</h3>
         </div>
         {/* Empty state for new accounts */}
         <div className="p-8 text-center text-[var(--text-muted)] font-mono text-xs">
             NO_INVOICES_GENERATED
         </div>
      </div>
    </TeamLayout>
  );
}
