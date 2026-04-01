import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Database, FileText, Search, Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { aiApi } from '../../services/aiApi';
import { Skeleton } from '../../components/ui/Skeleton';

export const KnowledgePage: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['ai-knowledge-documents'],
    queryFn: async () => {
      const res = await aiApi.listDocuments();
      return Array.isArray(res) ? res : [];
    }
  });

  const { mutate: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => aiApi.uploadDocumentFile(file),
    onSuccess: () => {
      refetch();
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Knowledge Base</h2>
          <p className="text-sm text-slate-500">RAG document sources — indexed documents that power the AI Assistant's domain knowledge.</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt,.csv"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-violet-700 disabled:bg-violet-400 transition flex items-center gap-2"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-700">ID</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Document Name</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Type</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Indexed</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={5} className="px-5 py-4"><Skeleton className="h-8 w-full" /></td></tr>
            ))
          ) : (
            documents?.map((d: any) => (
              <tr key={d.doc_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-mono font-medium text-slate-900 text-xs">{(d.doc_id || '').substring(0, 8)}</td>
                <td className="px-5 py-3 font-medium text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" /> 
                  <span className="truncate max-w-[300px]">{d.title}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {d.title.split('.').pop() || 'DOC'}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${d.status === 'indexed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {d.status === 'indexing' ? 'Pending' : 'Yes'}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-500">{new Date(d.uploaded_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};
