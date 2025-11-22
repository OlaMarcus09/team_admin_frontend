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
          
          {/* Plan Details */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 bg-[var(--color-primary)] text-white text-[10px] font-mono uppercase">Active</div>
             <div className="text-[var(--color-primary)] font-mono text-xs uppercase mb-2">Current Subscription</div>
             <div className="text-3xl font-bold text-[var(--text-main)] mb-4">ENTERPRISE_V1</div>
             <div className="text-sm text-[var(--text-muted)] mb-6">25 Seats • Unlimited Access</div>
             <button className="w-full py-3 border border-[var(--border-color)] text-[var(--text-main)] font-mono text-xs hover:bg-[var(--bg-input)] transition-colors uppercase">
                Upgrade Plan
             </button>
          </div>

          {/* Payment Method */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6">
             <div className="text-[var(--text-muted)] font-mono text-xs uppercase mb-4">Payment Method</div>
             <div className="flex items-center mb-6">
                <div className="w-10 h-6 bg-slate-800 rounded-sm mr-3"></div>
                <div className="font-mono text-sm text-[var(--text-main)]">•••• 4242</div>
             </div>
             <button className="flex items-center text-[var(--color-primary)] font-mono text-xs hover:underline uppercase">
                <CreditCard className="w-4 h-4 mr-2" /> Update Card
             </button>
          </div>
      </div>

      <div className="mt-8 bg-[var(--bg-surface)] border border-[var(--border-color)]">
         <div className="p-4 border-b border-[var(--border-color)]">
            <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold">Invoice History</h3>
         </div>
         <table className="w-full text-left">
            <thead>
                <tr className="text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase bg-[var(--bg-input)]">
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Download</th>
                </tr>
            </thead>
            <tbody className="font-mono text-xs">
                {[1,2,3].map((i) => (
                    <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors">
                        <td className="p-4 text-[var(--text-main)]">INV-2025-00{i}</td>
                        <td className="p-4 text-[var(--text-muted)]">Nov {22-i}, 2025</td>
                        <td className="p-4 text-[var(--text-main)] font-bold">₦2,500,000</td>
                        <td className="p-4 text-green-500">PAID</td>
                        <td className="p-4 text-right">
                            <button className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                                <Download className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>
    </TeamLayout>
  );
}
