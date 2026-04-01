import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft, LogIn, Home } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 bg-rose-50 rounded-2xl">
          <ShieldOff className="w-12 h-12 text-rose-400" />
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900">403</h1>
          <p className="text-lg text-slate-600 mt-2">Access Denied</p>
          <p className="text-sm text-slate-400 mt-1">Your current role does not have permission to view this resource. Contact your administrator if you believe this is an error.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-sm">
            <Home className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => navigate('/login')} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm">
            <LogIn className="w-4 h-4" /> Re-Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};
