import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Shield, Check, CreditCard, Briefcase, Users } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for Paystack to avoid SSR issues
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

// --- MOCK LAYOUT (If you have a real Layout, import it instead) ---
const TeamLayout = ({ children }) => (
  <div className="min-h-screen font-mono selection:bg-[#FF5E3A] selection:text-[#020617]">
    {/* CSS Variables for the Cyberpunk/Financial Theme */}
    <style jsx global>{`
      :root {
        --bg-main: #020617;       /* Navy */
        --bg-surface: #0f172a;    /* Lighter Navy */
        --color-primary: #FF5E3A; /* Orange */
        --text-main: #f8fafc;     /* White/Slate-50 */
        --text-muted: #94a3b8;    /* Slate-400 */
        --border-color: #1e293b;  /* Slate-800 */
      }
      body {
        background-color: var(--bg-main);
        color: var(--text-main);
      }
    `}</style>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-12 flex items-center gap-4 text-[var(--color-primary)] border-b border-[var(--border-color)] pb-4">
            <div className="w-4 h-4 bg-[var(--color-primary)]"></div>
            <span className="font-bold tracking-widest uppercase">Workspace Africa // Team Admin</span>
        </nav>
        {children}
    </div>
  </div>
);

export default function BillingPage() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Paystack Public Key
  const publicKey = 'pk_test_33ced6d752ba6716b596d2d5159231e7b23d87c7'; 
  
  const teamPlan = { 
    name: "CORPORATE_ACCESS_V1", 
    price: 500000, 
    seats: 10,
    features: [
        "10 Flex Pro Seats",
        "Unified Invoicing",
        "Priority Support",
        "Usage Analytics Dashboard",
        "Cross-Node Access (All 7 Hubs)"
    ]
  };

  useEffect(() => {
    // Simulate fetching user from localStorage or Context
    const email = localStorage.getItem('user_email') || 'admin@startuphq.ng'; 
    setUser({ email });
    setIsReady(true);
  }, []);

  const handleSuccess = (reference) => {
    // In production: Call backend to verify transaction and provision seats
    alert("Corporate Account Activated! Ref: " + reference.reference);
    console.log("Paystack Ref:", reference);
  };

  const handleClose = () => {
    console.log("Payment flow closed");
  };

  const componentProps = {
      email: user?.email,
      amount: teamPlan.price * 100, // Paystack expects amount in kobo
      publicKey,
      text: 'INITIATE TRANSFER',
      onSuccess: handleSuccess,
      onClose: handleClose,
  };

  if (!isReady) return null;

  return (
    <TeamLayout>
      <Head>
        <title>Billing | Team Admin</title>
      </Head>

      <div className="mb-12 border-l-4 border-[var(--color-primary)] pl-6">
        <h1 className="text-4xl font-bold text-[var(--text-main)] mb-2 uppercase tracking-tight">
          Subscription <span className="text-[var(--color-primary)]">Matrix</span>
        </h1>
        <p className="text-[var(--text-muted)] font-mono text-sm uppercase tracking-widest">
          Manage Enterprise Licenses & Invoices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Plan Card */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border-t-4 border-t-[var(--color-primary)] border border-[var(--border-color)] p-8 shadow-2xl relative overflow-hidden group">
             {/* Decorative background element */}
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Briefcase size={120} />
             </div>

             <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-main)] font-mono uppercase">
                        Enterprise Node
                    </h2>
                    <div className="text-[var(--color-primary)] font-mono text-xs mt-1 border border-[var(--color-primary)] inline-block px-2 py-1">
                        10 SEAT LICENSE
                    </div>
                </div>
                <Shield className="w-10 h-10 text-[var(--color-primary)]" />
             </div>

             <div className="mb-8 relative z-10">
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-[var(--text-main)] font-mono">
                        ₦{teamPlan.price.toLocaleString()}
                    </span>
                    <span className="text-[var(--text-muted)] font-mono text-sm mb-2">/month</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm mt-2">
                    Billed monthly. Cancel anytime via written notice.
                </p>
             </div>

             {/* Feature List */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
                {teamPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-[var(--text-main)]">
                        <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                        <span className="font-mono">{feature}</span>
                    </div>
                ))}
             </div>

             {/* Paystack Button */}
             <div className="w-full relative z-10 group-hover:translate-y-[-2px] transition-transform duration-200">
                <div className="absolute inset-0 bg-[var(--color-primary)] blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-full py-4 bg-[var(--color-primary)] text-[#020617] font-mono text-sm font-bold uppercase hover:bg-orange-500 transition-all text-center cursor-pointer shadow-xl flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <PaystackButton {...componentProps} className="w-full h-full absolute inset-0 opacity-0 cursor-pointer" />
                    <span>Activate Team Plan</span>
                </div>
             </div>
          </div>

          {/* Side Panel: Current Status */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6">
            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase mb-4 font-mono">
                Account Status
            </h3>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[var(--text-main)] font-bold">INACTIVE</span>
            </div>
            
            <div className="space-y-4 border-t border-[var(--border-color)] pt-4">
                <div>
                    <div className="text-xs text-[var(--text-muted)] uppercase">Billing Email</div>
                    <div className="text-sm font-mono text-[var(--text-main)] truncate">{user?.email}</div>
                </div>
                <div>
                    <div className="text-xs text-[var(--text-muted)] uppercase">Next Invoice</div>
                    <div className="text-sm font-mono text-[var(--text-main)]">--/--/----</div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-[#020617] border border-[var(--border-color)]">
                <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                    <Users size={16} />
                    <span className="text-xs font-bold uppercase">Need more seats?</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    For teams larger than 50, please contact sales@workspace.africa for custom API integration and dedicated hardware nodes.
                </p>
            </div>
          </div>

      </div>
    </TeamLayout>
  );
}
