
import React from 'react';
import { TrendingUp, TrendingDown, Globe, Search } from 'lucide-react';
import { MarketData } from '../types';
import { MOCK_MARKET_DATA } from '../constants';

const MarketTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Global Markets</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Updates
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MARKET_DATA.map((market, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900">{market.symbol}</h3>
                <p className="text-xs text-slate-500">{market.name}</p>
              </div>
              <div className={`p-2 rounded-xl ${market.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {market.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">₹{market.price.toLocaleString()}</span>
              <span className={`text-sm font-medium ${market.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {market.change >= 0 ? '+' : ''}{market.changePercent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">AI Market Sentiment</h3>
          <p className="text-indigo-100 mb-6 max-w-lg">
            Based on current trends, the tech sector shows strong resilience. 
            Consider diversifying into stable indices like NIFTY 50 while maintaining a small crypto hedge.
          </p>
          <button className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
            View Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketTracker;
