import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 bg-slate-100 rounded-2xl">
          <SearchX className="w-12 h-12 text-slate-400" />
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900">404</h1>
          <p className="text-lg text-slate-600 mt-2">Page not found</p>
          <p className="text-sm text-slate-400 mt-1">The resource you requested doesn&apos;t exist or has been moved.</p>
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm">
            <Home className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
