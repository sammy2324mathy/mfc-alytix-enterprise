import React, { useState } from 'react';
import { Save, Globe, Database, Shield, Bell, Clock, Server } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [auditRetention, setAuditRetention] = useState(365);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Platform Settings</h2>
          <p className="text-sm text-slate-500">Core security policy, API gateway, SSO, and retention configuration.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* Security Policy */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">Security Policy</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex justify-between">
              <span>Session Timeout (minutes)</span>
              <span className="text-indigo-600 font-mono">{sessionTimeout}</span>
            </label>
            <input type="range" min={5} max={120} step={5} value={sessionTimeout} onChange={e => setSessionTimeout(parseInt(e.target.value))} className="w-full accent-indigo-600" />
            <p className="text-xs text-slate-500">Inactive sessions are terminated after this duration.</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex justify-between">
              <span>Audit Log Retention (days)</span>
              <span className="text-indigo-600 font-mono">{auditRetention}</span>
            </label>
            <input type="range" min={90} max={730} step={30} value={auditRetention} onChange={e => setAuditRetention(parseInt(e.target.value))} className="w-full accent-indigo-600" />
            <p className="text-xs text-slate-500">Regulatory minimum: 365 days for financial services.</p>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={mfaEnforced} onChange={e => setMfaEnforced(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Enforce MFA for all users</span>
            </label>
            <p className="text-xs text-slate-500 ml-7">TOTP (Google Authenticator) or hardware key for SSO sessions.</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Password Complexity Policy</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500">
              <option>Strong (12+ chars, uppercase, number, symbol)</option>
              <option>Standard (8+ chars, mixed case)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integration Endpoints */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Globe className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">API Gateway & Integrations</h3>
        </div>
        <div className="p-6 space-y-5">
          {[
            { name: 'Auth Service', url: 'http://localhost:8001', status: 'Healthy' },
            { name: 'Accounting Service', url: 'http://localhost:8002', status: 'Healthy' },
            { name: 'Actuarial Engine', url: 'http://localhost:8004', status: 'Healthy' },
            { name: 'AI Inference (RAG)', url: 'http://localhost:8006', status: 'Degraded' },
          ].map(svc => (
            <div key={svc.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-sm font-medium text-slate-700">{svc.name}</span>
                  <span className="text-xs text-slate-400 ml-2 font-mono">{svc.url}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${svc.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification & Scheduler */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">Notifications & Scheduler</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Email on RBAC violation</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Email on regulatory deadline (7 days before)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Slack webhook integration</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Depreciation Batch Schedule
            </label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500">
              <option>Monthly (1st business day)</option>
              <option>Weekly (Monday)</option>
              <option>Manual only</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
