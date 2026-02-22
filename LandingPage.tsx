
import React, { useState } from 'react';
import { ArrowRight, Shield, Zap, BarChart3, Globe, MessageSquare } from 'lucide-react';
import { UserProfile } from '../types';

interface LandingPageProps {
  onStart: (profile: UserProfile) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [formData, setFormData] = useState({ name: '', businessName: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onStart(formData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400 blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-8 border border-indigo-100">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Finance is Here
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            Control Your Money. <br />
            <span className="gradient-text">Predict Your Future.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            REHCAPS is the modern financial operating system for individuals and small businesses. 
            Track, analyze, and grow your wealth with AI-driven insights.
          </p>
          
          <div className="max-w-md mx-auto glass p-8 rounded-3xl shadow-xl border border-white/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Business Name (Optional)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.businessName}
                onChange={e => setFormData({...formData, businessName: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <button
                type="submit"
                className="w-full gradient-bg text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:opacity-90 transition-all flex items-center justify-center group"
              >
                Start Managing Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to master your finances</h2>
            <p className="text-slate-600">Powerful tools designed for the modern economy.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <BarChart3 className="w-6 h-6" />, title: 'Smart Analytics', desc: 'Visualize your cashflow with beautiful, interactive charts and deep-dive reports.' },
              { icon: <MessageSquare className="w-6 h-6" />, title: 'Automated Reminders', desc: 'Send professional WhatsApp and SMS reminders to clients who owe you money.' },
              { icon: <Shield className="w-6 h-6" />, title: 'AI Advisor', desc: 'Get personalized financial advice and cost-cutting suggestions from our Gemini-powered AI.' },
              { icon: <Globe className="w-6 h-6" />, title: 'Market Tracking', desc: 'Monitor global markets, crypto, and forex prices in real-time from your dashboard.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Instant Invoices', desc: 'Generate and download professional PDF summaries and invoices in one click.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Secure & Private', desc: 'Your financial data is encrypted and protected with enterprise-grade security.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold tracking-tight">REHCAPS</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 REHCAPS Finance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
