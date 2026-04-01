import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { BarChart3, Eye, Users, FileText } from 'lucide-react';

const dashboards = [
  { id: 'DB-01', name: 'Executive Claims Summary', views: '2,340', audience: 'C-Suite', refreshRate: 'Daily', status: 'Live' },
  { id: 'DB-02', name: 'Underwriting Risk Heatmap', views: '1,890', audience: 'Underwriters', refreshRate: 'Hourly', status: 'Live' },
  { id: 'DB-03', name: 'Product Profitability Tracker', views: '1,420', audience: 'Product Team', refreshRate: 'Weekly', status: 'Live' },
  { id: 'DB-04', name: 'Fraud Alert Console', views: '980', audience: 'Fraud Investigators', refreshRate: 'Real-time', status: 'Live' },
  { id: 'DB-05', name: 'Customer Churn Dashboard', views: '1,150', audience: 'CX Team', refreshRate: 'Daily', status: 'Live' },
  { id: 'DB-06', name: 'Regulatory Compliance Monitor', views: '540', audience: 'Compliance', refreshRate: 'Daily', status: 'Draft' },
];

export const DSDashboardsPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-slate-900">Dashboards & Reporting</h2>
      <p className="text-sm text-slate-500">Interactive data visualizations and automated management reports powering data-driven decisions across the enterprise.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Published Dashboards" value="5" trend="1 in draft" trendDirection="neutral" icon={<BarChart3 className="w-5 h-5" />} />
      <MetricCard title="Monthly Views" value="8.3K" trend="+22% vs last month" trendDirection="up" icon={<Eye className="w-5 h-5" />} />
      <MetricCard title="Unique Users" value="186" trend="Active consumers" trendDirection="up" icon={<Users className="w-5 h-5" />} />
      <MetricCard title="Scheduled Reports" value="12" trend="Auto-delivered" trendDirection="neutral" icon={<FileText className="w-5 h-5" />} />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50"><h3 className="font-semibold text-slate-800">Dashboard Catalog</h3></div>
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3">Dashboard</th>
            <th className="px-5 py-3">Audience</th>
            <th className="px-5 py-3 text-right">Views (MTD)</th>
            <th className="px-5 py-3">Refresh</th>
            <th className="px-5 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {dashboards.map(d => (
            <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3"><span className="font-mono text-xs text-slate-400 mr-2">{d.id}</span><span className="font-medium text-slate-700">{d.name}</span></td>
              <td className="px-5 py-3 text-xs">{d.audience}</td>
              <td className="px-5 py-3 text-right font-mono">{d.views}</td>
              <td className="px-5 py-3 text-xs font-mono">{d.refreshRate}</td>
              <td className="px-5 py-3 text-center"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${d.status === 'Live' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{d.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
