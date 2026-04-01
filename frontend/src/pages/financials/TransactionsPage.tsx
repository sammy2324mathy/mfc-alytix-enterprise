import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Lock, CheckSquare, XSquare, Plus, Save, Send, AlertCircle, FileText } from 'lucide-react';

interface JournalLine {
  id: string;
  account: string;
  debit: number;
  credit: number;
  summary: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  lines: JournalLine[];
  status: 'Draft' | 'Pending Review' | 'Posted';
  submitter: string;
}

const mockChartOfAccounts = [
  '1000 - Cash & Equivalents',
  '1200 - Premium Receivables',
  '2100 - Claims Payable',
  '2400 - Unearned Premium Reserve',
  '3000 - Retained Earnings',
  '4000 - Gross Written Premium',
  '5100 - Claims Incurred',
  '6200 - Commission Expense'
];

export const TransactionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdminOrChief = user?.roles.includes('admin') || user?.roles.includes('chief_accountant');
  const isJunior = user?.roles.includes('junior_accountant');
  const username = user?.roles.includes('admin') ? 'System Admin' : 
                   user?.roles.includes('chief_accountant') ? 'Chief Accountant' : 'Junior Analyst';

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'JRNL-8931', date: '2025-11-01', description: 'Monthly Claims Reserving', status: 'Pending Review', submitter: 'Junior Analyst',
      lines: [
        { id: '1', account: '5100 - Claims Incurred', debit: 45000.00, credit: 0, summary: 'Increase in IBNR' },
        { id: '2', account: '2100 - Claims Payable', debit: 0, credit: 45000.00, summary: 'Accrual for Q3' }
      ]
    },
    {
      id: 'JRNL-8932', date: '2025-11-02', description: 'Reinsurance Commission', status: 'Posted', submitter: 'System Admin',
      lines: [
        { id: '1', account: '1000 - Cash & Equivalents', debit: 12500.00, credit: 0, summary: 'Q3 RI Commission Recv' },
        { id: '2', account: '6200 - Commission Expense', debit: 0, credit: 12500.00, summary: 'Offset RI Ceded' }
      ]
    }
  ]);

  const [isDrafting, setIsDrafting] = useState(false);
  const [draftDesc, setDraftDesc] = useState('');
  const [draftDate, setDraftDate] = useState(new Date().toISOString().split('T')[0]);
  const [draftLines, setDraftLines] = useState<JournalLine[]>([
    { id: 'init-1', account: '', debit: 0, credit: 0, summary: '' },
    { id: 'init-2', account: '', debit: 0, credit: 0, summary: '' }
  ]);

  const addLine = () => setDraftLines([...draftLines, { id: Date.now().toString(), account: '', debit: 0, credit: 0, summary: '' }]);

  const updateLine = (id: string, field: keyof JournalLine, value: any) => {
    setDraftLines(draftLines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLine = (id: string) => {
    if (draftLines.length <= 2) return;
    setDraftLines(draftLines.filter(l => l.id !== id));
  };

  const totalDebit = draftLines.reduce((acc, l) => acc + (Number(l.debit) || 0), 0);
  const totalCredit = draftLines.reduce((acc, l) => acc + (Number(l.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSaveDraft = (postImmediately = false) => {
    if (!isBalanced) return;
    const newTx: Transaction = {
      id: `JRNL-${Math.floor(8000 + Math.random() * 1000)}`,
      date: draftDate,
      description: draftDesc || 'Standard Journal Entry',
      lines: draftLines,
      status: postImmediately ? 'Posted' : 'Pending Review',
      submitter: username
    };
    setTransactions([newTx, ...transactions]);
    setIsDrafting(false);
    setDraftLines([{ id: 'init-1', account: '', debit: 0, credit: 0, summary: '' }, { id: 'init-2', account: '', debit: 0, credit: 0, summary: '' }]);
    setDraftDesc('');
  };

  const updateStatus = (id: string, newStatus: 'Posted' | 'Draft') => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">General Ledger Journals</h2>
          <p className="text-sm text-slate-500">Double-entry accounting with batch drafting, multi-level approvals, and full audit trail.</p>
        </div>
        <button 
          onClick={() => setIsDrafting(!isDrafting)}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-sky-700 transition"
        >
          {isDrafting ? 'Cancel Draft' : '+ New Journal Entry'}
        </button>
      </div>

      {isDrafting && (
        <div className="bg-white rounded-xl shadow-lg border border-sky-100 overflow-hidden ring-1 ring-sky-100">
          <div className="p-5 border-b border-slate-100 bg-sky-50/50 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-sky-600"/> Create Journal Batch</h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Accounting Date</label>
                <input type="date" value={draftDate} onChange={e => setDraftDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Description</label>
                <input type="text" placeholder="e.g., EOFY Gross Written Premium Accrual" value={draftDesc} onChange={e => setDraftDesc(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500" />
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-4 py-2">Account Code</th>
                    <th className="px-4 py-2">Line Description</th>
                    <th className="px-4 py-2 w-32 text-right">Debit</th>
                    <th className="px-4 py-2 w-32 text-right">Credit</th>
                    <th className="px-4 py-2 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {draftLines.map((line) => (
                    <tr key={line.id}>
                      <td className="px-2 py-2">
                        <select 
                          className="w-full border-transparent bg-slate-50 rounded px-2 py-1 text-xs"
                          value={line.account} onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                        >
                          <option value="">Select Account...</option>
                          {mockChartOfAccounts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input type="text" className="w-full border-transparent bg-slate-50 rounded px-2 py-1 text-xs" placeholder="Memo" value={line.summary} onChange={(e) => updateLine(line.id, 'summary', e.target.value)} />
                      </td>
                      <td className="px-2 py-2">
                        <input type="number" min="0" step="0.01" className={`w-full text-right border-transparent rounded px-2 py-1 text-xs ${line.debit > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50'}`} value={line.debit || ''} onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="px-2 py-2">
                        <input type="number" min="0" step="0.01" className={`w-full text-right border-transparent rounded px-2 py-1 text-xs ${line.credit > 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-50'}`} value={line.credit || ''} onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => removeLine(line.id)} className="text-slate-400 hover:text-rose-500"><XSquare className="w-4 h-4 mx-auto"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-right text-slate-500">
                      <button onClick={addLine} className="float-left text-sky-600 flex items-center gap-1 text-xs font-medium"><Plus className="w-3 h-3"/> Add Line</button>
                      Total:
                    </td>
                    <td className={`px-4 py-3 text-right font-mono ${totalDebit > 0 && totalDebit !== totalCredit ? 'text-rose-600' : 'text-slate-700'}`}>${totalDebit.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${totalCredit > 0 && totalDebit !== totalCredit ? 'text-rose-600' : 'text-slate-700'}`}>${totalCredit.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
                   <span className="flex items-center gap-1 text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded">
                     <AlertCircle className="w-4 h-4"/> Debits must equal Credits to proceed.
                   </span>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSaveDraft(false)}
                  disabled={!isBalanced || draftLines.length < 2}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-slate-700 transition"
                >
                  <Save className="w-4 h-4"/> Submit for Review
                </button>
                {isAdminOrChief ? (
                  <button 
                    onClick={() => handleSaveDraft(true)}
                    disabled={!isBalanced || draftLines.length < 2}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-emerald-700 transition"
                  >
                    <Send className="w-4 h-4"/> Post Journal
                  </button>
                ) : (
                  <button disabled className="bg-slate-100 text-slate-400 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border border-slate-200">
                    <Lock className="w-4 h-4"/> Post Journal (Chief Only)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Ledger Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Entry ID</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Date / Desc</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Creator</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Total Debit</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Manager Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const txTotal = tx.lines.reduce((acc, l) => acc + l.debit, 0);
                return (
                  <React.Fragment key={tx.id}>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900 align-top">{tx.id}</td>
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-slate-900">{tx.date}</div>
                        <div className="text-xs text-slate-500 mt-1">{tx.description}</div>
                      </td>
                      <td className="px-6 py-4 align-top text-xs font-medium text-slate-600">{tx.submitter}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-700 align-top">
                        ${txTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                          tx.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' :
                          tx.status === 'Draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        {tx.status === 'Pending Review' ? (
                          isAdminOrChief ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => updateStatus(tx.id, 'Posted')} className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded transition-colors" title="Approve & Post">
                                <CheckSquare className="w-4 h-4"/>
                              </button>
                              <button onClick={() => updateStatus(tx.id, 'Draft')} className="text-rose-600 hover:text-rose-800 bg-rose-50 p-1.5 rounded transition-colors" title="Reject to Draft">
                                <XSquare className="w-4 h-4"/>
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs italic text-slate-400 flex items-center justify-end gap-1"><Lock className="w-3 h-3"/> Read-only</span>
                          )
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                    {/* Line Items Expansion */}
                    {tx.lines.map((l, idx) => (
                      <tr key={l.id} className={`bg-slate-50/50 ${idx === tx.lines.length - 1 ? 'border-b-2 border-slate-200' : ''}`}>
                        <td colSpan={2} className="px-6 py-1.5 pl-12 text-xs font-mono text-slate-500">{l.account}</td>
                        <td colSpan={2} className="px-6 py-1.5 text-xs text-slate-500">{l.summary}</td>
                        <td colSpan={2} className="px-6 py-1.5 text-right font-mono text-xs">
                           <span className={l.debit > 0 ? 'text-emerald-600 font-medium mr-4' : 'text-slate-400 mr-4'}>DR: {l.debit > 0 ? l.debit : '-'}</span>
                           <span className={l.credit > 0 ? 'text-rose-600 font-medium' : 'text-slate-400'}>CR: {l.credit > 0 ? l.credit : '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
