import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, Table, Layers, FileCode, RefreshCw, Search, Filter } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { Skeleton } from '../../components/ui/Skeleton';
import { MetricCard } from '../../components/data-display/MetricCard';

export const DatasetsPage: React.FC = () => {
  const { data: datasets, isLoading, refetch } = useQuery({
    queryKey: ['ds-datasets'],
    queryFn: async () => {
      // Mock data for datasets (could be expanded in dataScienceApi)
      return [
        { id: 'DB-CLAIM-MAIN', name: 'Primary Claims Warehouse', rows: '12.4M', size: '4.8 GB', lastSync: '1h ago', type: 'SQL' },
        { id: 'DB-MOR-EXPER', name: 'Mortality Experience Analysis', rows: '890K', size: '1.2 GB', lastSync: '12h ago', type: 'CSV' },
        { id: 'DB-CUS-SENTI', name: 'Customer Sentiment Streams', rows: '4.2M', size: '2.1 GB', lastSync: 'Real-time', type: 'NoSQL' },
        { id: 'DB-EXT-GEO', name: 'External Georeference Indices', rows: '150K', size: '450 MB', lastSync: '3d ago', type: 'Parquet' },
      ];
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Active Datasets</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Enterprise data sources, feature stores, and transformation pipelines.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search registry..." className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
           </div>
           <button onClick={() => refetch()} className="p-2 bg-white rounded-2xl border border-slate-100 shadow-premium-sm text-slate-400 hover:text-indigo-600 transition-all">
             <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Storage" value="8.55 GB" trend="Optimal" trendDirection="up" icon={<Database className="w-5 h-5" />} />
        <MetricCard title="Schema health" value="100%" trend="Clean" trendDirection="up" icon={<Layers className="w-5 h-5" />} />
        <MetricCard title="Data Velocity" value="1.2 GB/h" trend="+15%" trendDirection="up" icon={<RefreshCw className="w-5 h-5" />} />
        <MetricCard title="Quality Score" value="99.8" trend="A+" trendDirection="up" icon={<Table className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
        ) : (
          datasets?.map((ds) => (
            <div key={ds.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium group hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                  <FileCode className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ds.type} Source</p>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ds.name}</h4>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Record Count</span>
                  <span className="text-xs font-bold text-slate-900">{ds.rows}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500 font-medium">Volume</span>
                  <span className="text-xs font-bold text-slate-900">{ds.size}</span>
                </div>
                 <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500 font-medium">Last Sync</span>
                  <span className="text-xs font-bold text-indigo-600">{ds.lastSync}</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-inner hover:shadow-premium">
                Explore Features
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
