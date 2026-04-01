import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { BarChart3, Gauge, Target, TrendingUp } from 'lucide-react';

/**
 * FP&A / executive analytics — chief_accountant (and admin) via route guard.
 * Junior accountants still own upstream duties (sub-ledgers, drafts, standard MI); this screen is for
 * leadership synthesis and sign-off on top of that work.
 */
export const DecisionsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Business decisions &amp; FP&amp;A</h2>
        <p className="text-sm text-slate-500 mt-1">
          Budget vs actuals, forecasting, and executive KPIs — aligned with the &ldquo;Supporting business
          decisions&rdquo; layer of the accounting cycle (executive management reporting).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Budget variance (YTD)"
          value="−2.4%"
          trend="vs plan"
          trendDirection="down"
          description="Group consolidated"
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <MetricCard
          title="Forecast confidence"
          value="87%"
          trend="+3 pts"
          trendDirection="up"
          description="Rolling 4-quarter model"
          icon={<Gauge className="w-5 h-5" />}
        />
        <MetricCard
          title="Strategic initiatives"
          value="12"
          trend="4 at risk"
          trendDirection="neutral"
          description="Board-tracked programs"
          icon={<Target className="w-5 h-5" />}
        />
        <MetricCard
          title="Revenue outlook"
          value="+6.1%"
          trend="next FY"
          trendDirection="up"
          description="Management case"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Scenario workspace</h3>
        <p className="text-sm text-slate-600 mb-4">
          Connect ledger actuals from General Ledger &amp; Statutory Reports to driver-based forecasts. Use this
          area for leadership packs and sign-off before board circulation.
        </p>
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
          Interactive scenario builder and export to management pack — wire to analytics services in a later
          integration phase.
        </div>
      </div>
    </div>
  );
};
