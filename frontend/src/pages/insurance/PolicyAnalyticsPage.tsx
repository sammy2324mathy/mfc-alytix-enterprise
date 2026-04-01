import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Shield, Calendar,
  BarChart3, PieChart, Activity, Target, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';

export const PolicyAnalyticsPage: React.FC = () => {
  const { data: dashboard } = useQuery({
    queryKey: ['insurance-dashboard'],
    queryFn: financialApi.getInsuranceDashboard,
  });

  const stats = dashboard?.policies || {};
  const fins = dashboard?.financials || {};
  const productBreakdown = dashboard?.product_breakdown || {};

  const growthData = [
    { month: 'Jan', policies: 120, premiums: 2400000 },
    { month: 'Feb', policies: 135, premiums: 2700000 },
    { month: 'Mar', policies: 142, premiums: 2850000 },
    { month: 'Apr', policies: 158, premiums: 3200000 },
    { month: 'May', policies: 165, premiums: 3350000 },
    { month: 'Jun', policies: 171, premiums: 3450000 },
  ];

  const claimsData = [
    { type: 'Death', count: 12, amount: 2400000 },
    { type: 'Maturity', count: 8, amount: 1600000 },
    { type: 'Disability', count: 5, amount: 750000 },
    { type: 'Hospital', count: 15, amount: 450000 },
    { type: 'Funeral', count: 18, amount: 360000 },
  ];

  const lapseRate = ((stats.lapsed || 0) / (stats.active || 1) * 100).toFixed(1);
  const persistencyRate = ((stats.active || 0) / (stats.total || 1) * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-violet-500" />
          Policy Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Insurance portfolio performance, trends, and insights
        </p>
      </div>

      {/* ── Key Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.3%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.total || 0}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Policies</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-sky-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-sky-600" />
            </div>
            <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8.7%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-800">
            ${(fins.total_annual_premium || 0).toLocaleString()}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Annual Premiums</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-50 rounded-xl">
              <Target className="w-6 h-6 text-violet-600" />
            </div>
            <span className="text-xs font-bold text-violet-600">{persistencyRate}%</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{persistencyRate}%</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Persistency Rate</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> -2.1%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-800">{lapseRate}%</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Lapse Rate</p>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Portfolio Growth
          </h3>
          <div className="space-y-4">
            {growthData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 w-12">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${(item.policies / 200) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-16 text-right">
                      {item.policies}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-50 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(item.premiums / 4000000) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-16 text-right">
                      ${(item.premiums / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 bg-emerald-500 rounded-full" />
              <span className="text-slate-600">Policies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 bg-sky-500 rounded-full" />
              <span className="text-slate-600">Premiums</span>
            </div>
          </div>
        </div>

        {/* Product Mix */}
        <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-violet-500" />
            Product Mix
          </h3>
          <div className="space-y-3">
            {Object.entries(productBreakdown).map(([product, count]) => (
              <div key={product} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    product === 'LIFE' ? 'bg-emerald-500' :
                    product === 'TERM' ? 'bg-sky-500' :
                    product === 'WHOLE_LIFE' ? 'bg-violet-500' :
                    product === 'ENDOWMENT' ? 'bg-amber-500' :
                    product === 'FUNERAL' ? 'bg-rose-500' :
                    'bg-slate-400'
                  }`} />
                  <span className="text-sm text-slate-700">{product.replace(/_/g, ' ')}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Claims Analysis ── */}
      <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-rose-500" />
          Claims Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4">Claims by Type</h4>
            <div className="space-y-3">
              {claimsData.map((claim, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{claim.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-800">{claim.count}</span>
                    <span className="text-sm text-slate-500">
                      ${(claim.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4">Claims Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose-50 rounded-xl p-4">
                <p className="text-xl font-black text-rose-600">
                  {(fins.total_claims_paid || 0).toLocaleString()}
                </p>
                <p className="text-xs text-rose-600 font-bold mt-1">Total Paid</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xl font-black text-amber-600">
                  {dashboard?.claims?.pending || 0}
                </p>
                <p className="text-xs text-amber-600 font-bold mt-1">Pending</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xl font-black text-emerald-600">
                  {dashboard?.claims?.approved || 0}
                </p>
                <p className="text-xs text-emerald-600 font-bold mt-1">Approved</p>
              </div>
              <div className="bg-sky-50 rounded-xl p-4">
                <p className="text-xl font-black text-sky-600">94%</p>
                <p className="text-xs text-sky-600 font-bold mt-1">Settlement Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Performance Indicators ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-emerald-800">New Business</h4>
          </div>
          <p className="text-2xl font-black text-emerald-800">28</p>
          <p className="text-sm text-emerald-600 mt-1">Policies this month</p>
          <div className="mt-3 text-xs text-emerald-700">
            <span className="font-bold">+15%</span> vs last month
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-6 h-6 text-sky-600" />
            <h4 className="font-bold text-sky-800">Average Premium</h4>
          </div>
          <p className="text-2xl font-black text-sky-800">$18,450</p>
          <p className="text-sm text-sky-600 mt-1">Per policy annually</p>
          <div className="mt-3 text-xs text-sky-700">
            <span className="font-bold">+5.2%</span> vs last quarter
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-violet-600" />
            <h4 className="font-bold text-violet-800">Customer Satisfaction</h4>
          </div>
          <p className="text-2xl font-black text-violet-800">4.8/5</p>
          <p className="text-sm text-violet-600 mt-1">Average rating</p>
          <div className="mt-3 text-xs text-violet-700">
            <span className="font-bold">92%</span> would recommend
          </div>
        </div>
      </div>
    </div>
  );
};
