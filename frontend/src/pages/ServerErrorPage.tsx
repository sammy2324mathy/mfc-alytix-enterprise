import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerCrash, ArrowLeft, RefreshCcw } from 'lucide-react';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 bg-amber-50 rounded-2xl">
          <ServerCrash className="w-12 h-12 text-amber-400" />
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900">500</h1>
          <p className="text-lg text-slate-600 mt-2">Internal Server Error</p>
          <p className="text-sm text-slate-400 mt-1">Something went wrong on our end. Our engineering team has been notified. Please try again shortly.</p>
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm">
            <RefreshCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    </div>
  );
};
