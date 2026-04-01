import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Download, Upload, Link2, Copy, Trash2, FileSpreadsheet, FileJson, FileText,
  Loader2, CheckCircle2, XCircle, RefreshCw, ExternalLink, Database, Share2,
  Clock, AlertTriangle
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import { useToast } from '../../components/ui/Toast';

type ExportFormat = 'csv' | 'json' | 'xlsx';

const FORMAT_ICONS: Record<ExportFormat, React.ReactNode> = {
  csv: <FileText className="w-4 h-4" />,
  json: <FileJson className="w-4 h-4" />,
  xlsx: <FileSpreadsheet className="w-4 h-4" />,
};

const FORMAT_LABELS: Record<ExportFormat, string> = {
  csv: 'CSV',
  json: 'JSON',
  xlsx: 'Excel (.xlsx)',
};

export const IntegrationHubPage: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedDataset, setSelectedDataset] = useState('accounts');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [importTarget, setImportTarget] = useState('accounts');
  const [shareDataset, setShareDataset] = useState('accounts');
  const [shareFormat, setShareFormat] = useState<ExportFormat>('csv');
  const [shareHours, setShareHours] = useState(24);

  const { data: datasets } = useQuery({
    queryKey: ['integration-datasets'],
    queryFn: financialApi.getIntegrationDatasets,
  });

  const { data: activeLinks, refetch: refetchLinks } = useQuery({
    queryKey: ['active-share-links'],
    queryFn: financialApi.getActiveShareLinks,
  });

  const exportMutation = useMutation({
    mutationFn: () => financialApi.exportDataset(selectedDataset, selectedFormat),
    onSuccess: () => showToast(`Exported ${selectedDataset} as ${selectedFormat.toUpperCase()}`, 'success'),
    onError: () => showToast('Export failed', 'error'),
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => financialApi.importDataset(importTarget, file),
    onSuccess: (data: any) => {
      showToast(`Imported ${data.imported} of ${data.total_rows} rows`, 'success');
      queryClient.invalidateQueries({ queryKey: ['ledger-accounts'] });
    },
    onError: () => showToast('Import failed', 'error'),
  });

  const shareMutation = useMutation({
    mutationFn: () => financialApi.createShareLink(shareDataset, shareFormat, shareHours),
    onSuccess: (data: any) => {
      showToast('Shareable link created', 'success');
      refetchLinks();
    },
    onError: () => showToast('Failed to create share link', 'error'),
  });

  const revokeMutation = useMutation({
    mutationFn: (token: string) => financialApi.revokeShareLink(token),
    onSuccess: () => {
      showToast('Link revoked', 'success');
      refetchLinks();
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importMutation.mutate(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(window.location.origin + text);
    showToast('Link copied to clipboard', 'success');
  };

  const allDatasets: string[] = datasets?.datasets || [
    'accounts', 'transactions', 'trial-balance', 'income-statement',
    'balance-sheet', 'cash-flow', 'financial-ratios', 'ap-aging', 'ar-aging',
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-sky-500" />
            Integration Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bidirectional data exchange — Jupyter, Excel, Monte Carlo, and external platforms
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Export Panel ── */}
        <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Download className="w-5 h-5 text-emerald-500" />
            Export Data
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Export datasets in CSV, JSON, or Excel for use in Jupyter Notebook, Excel, or Monte Carlo environments.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Dataset</label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
              >
                {allDatasets.map((ds) => (
                  <option key={ds} value={ds}>{ds.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Format</label>
              <div className="flex gap-2">
                {(['csv', 'json', 'xlsx'] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedFormat === fmt
                        ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-sky-200'
                    }`}
                  >
                    {FORMAT_ICONS[fmt]}
                    {FORMAT_LABELS[fmt]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {exportMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export {selectedDataset.replace(/-/g, ' ')}
            </button>
          </div>

          {/* Direct Access Endpoints */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Direct API Endpoints</h3>
            <div className="space-y-2 text-xs font-mono text-slate-500 bg-slate-50 rounded-xl p-4">
              <p className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">GET</span>
                /accounting/integrations/export/{'{dataset}'}?format={'{csv|json|xlsx}'}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-500 font-bold">POST</span>
                /accounting/integrations/import/{'{dataset}'}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">GET</span>
                /accounting/integrations/shared/{'{token}'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Import Panel ── */}
        <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Upload className="w-5 h-5 text-indigo-500" />
            Import Data
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Upload processed data from external tools back into the system. Supports CSV, JSON, and Excel.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Target Dataset</label>
              <select
                value={importTarget}
                onChange={(e) => setImportTarget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
              >
                <option value="accounts">Accounts (Chart of Accounts)</option>
                <option value="transactions">Transactions (Journal Entries)</option>
              </select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importMutation.isPending}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {importMutation.isPending ? 'Uploading...' : 'Select & Upload File'}
            </button>

            {importMutation.isSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Import Complete
                </div>
                <p className="text-emerald-600 text-xs mt-1">
                  {(importMutation.data as any)?.imported} of {(importMutation.data as any)?.total_rows} rows imported
                  {(importMutation.data as any)?.errors?.length > 0 && (
                    <span className="text-amber-600"> ({(importMutation.data as any)?.errors?.length} errors)</span>
                  )}
                </p>
              </div>
            )}

            {importMutation.isError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm flex items-center gap-2 text-rose-700">
                <XCircle className="w-4 h-4" />
                Import failed. Check file format and try again.
              </div>
            )}
          </div>

          {/* Supported formats */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Supported Formats</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['csv', 'json', 'xlsx'] as ExportFormat[]).map((fmt) => (
                <div key={fmt} className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-slate-400 flex justify-center mb-1">{FORMAT_ICONS[fmt]}</div>
                  <p className="text-xs font-bold text-slate-600">{FORMAT_LABELS[fmt]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Shareable Links ── */}
      <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Share2 className="w-5 h-5 text-amber-500" />
          Shareable Data Links
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Generate secure, expiring links for external tools like Jupyter notebooks to fetch data directly via HTTP.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Dataset</label>
            <select
              value={shareDataset}
              onChange={(e) => setShareDataset(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20"
            >
              {allDatasets.map((ds) => (
                <option key={ds} value={ds}>{ds.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Format</label>
            <select
              value={shareFormat}
              onChange={(e) => setShareFormat(e.target.value as ExportFormat)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Expires In (hours)</label>
            <input
              type="number"
              min={1}
              max={720}
              value={shareHours}
              onChange={(e) => setShareHours(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => shareMutation.mutate()}
              disabled={shareMutation.isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2.5 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {shareMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              Generate Link
            </button>
          </div>
        </div>

        {/* Active links table */}
        {(activeLinks?.active_links?.length ?? 0) > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Dataset</th>
                  <th className="px-4 py-3 font-semibold">Format</th>
                  <th className="px-4 py-3 font-semibold">Expires</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLinks.active_links.map((link: any) => (
                  <tr key={link.token} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {link.dataset.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                        {link.format?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(link.expires_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 truncate max-w-[200px]">
                      /accounting/integrations/shared/{link.token.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyToClipboard(`/accounting/integrations/shared/${link.token}`)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-600 transition-all"
                        title="Copy link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => revokeMutation.mutate(link.token)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-all"
                        title="Revoke link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeLinks?.active_links?.length ?? 0) === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            No active shareable links. Generate one above.
          </div>
        )}

        {/* Jupyter example */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Usage Example — Jupyter Notebook</h3>
          <pre className="bg-slate-900 text-emerald-400 rounded-xl p-4 text-xs overflow-x-auto">
{`import pandas as pd
import requests

# Fetch data via shareable link
url = "https://your-domain.com/accounting/integrations/shared/{token}"
response = requests.get(url, headers={"Authorization": "Bearer YOUR_TOKEN"})

# Load into DataFrame
df = pd.read_csv(io.StringIO(response.text))
print(df.head())

# After processing, upload back
files = {"file": ("processed.csv", df.to_csv(index=False), "text/csv")}
requests.post(
    "https://your-domain.com/accounting/integrations/import/accounts",
    files=files,
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)`}
          </pre>
        </div>
      </div>
    </div>
  );
};
