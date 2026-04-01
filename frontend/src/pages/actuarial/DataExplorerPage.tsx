import React, { useState } from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Database, Search, Download, Filter, Table2, FileDown, BarChart3 } from 'lucide-react';

const datasets = [
  { id: 'DS-POL', name: 'Policyholder Master', records: '1,842,561', lastRefresh: '2 hours ago', size: '2.4 GB', status: 'Live' },
  { id: 'DS-CLM', name: 'Claims Register', records: '421,093', lastRefresh: '1 hour ago', size: '890 MB', status: 'Live' },
  { id: 'DS-EXP', name: 'Exposure Data (Earned)', records: '3,201,440', lastRefresh: '6 hours ago', size: '4.1 GB', status: 'Live' },
  { id: 'DS-MORT', name: 'Mortality Experience', records: '89,204', lastRefresh: '1 day ago', size: '120 MB', status: 'Archived' },
  { id: 'DS-PREM', name: 'Premium Bordereaux', records: '564,802', lastRefresh: '3 hours ago', size: '1.1 GB', status: 'Live' },
  { id: 'DS-ASSET', name: 'Asset Portfolio', records: '12,450', lastRefresh: '30 min ago', size: '45 MB', status: 'Live' },
  { id: 'DS-REIN', name: 'Reinsurance Treaties', records: '342', lastRefresh: '2 days ago', size: '8 MB', status: 'Live' },
];

export const DataExplorerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = datasets.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Explorer</h2>
          <p className="text-sm text-slate-500">Query, inspect, and extract policyholder, claims, and exposure datasets for actuarial modeling.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search datasets..." className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-56" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Datasets" value={datasets.length.toString()} trend="Connected" trendDirection="up" icon={<Database className="w-5 h-5" />} />
        <MetricCard title="Total Records" value="6.1M" trend="Across all sources" trendDirection="neutral" icon={<Table2 className="w-5 h-5" />} />
        <MetricCard title="Total Volume" value="8.7 GB" trend="Compressed" trendDirection="neutral" icon={<BarChart3 className="w-5 h-5" />} />
        <MetricCard title="Last ETL Run" value="30m ago" trend="All sources healthy" trendDirection="up" icon={<Filter className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Available Datasets</h3>
          <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"><FileDown className="w-3.5 h-3.5" /> Export Catalog</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-700">Dataset ID</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Name</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-right">Records</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-right">Size</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Last Refresh</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ds => (
                <tr key={ds.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono font-medium text-slate-900">{ds.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-700">{ds.name}</td>
                  <td className="px-5 py-3 text-right font-mono">{ds.records}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs">{ds.size}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{ds.lastRefresh}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ds.status === 'Live' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{ds.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 ml-auto">
                      <Search className="w-3.5 h-3.5" /> Query
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
