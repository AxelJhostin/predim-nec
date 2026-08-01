import { CheckCircle2, CircleMinus, XCircle } from "lucide-react";
import type { ComplianceCriterion } from "@/utils/necCalculations";

interface ComplianceTableProps {
  criteria: ComplianceCriterion[];
  compact?: boolean;
}

const statusContent = {
  pass: {
    label: "PASA",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  fail: {
    label: "NO PASA",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  "not-evaluated": {
    label: "NO EVALUADO",
    icon: CircleMinus,
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export function ComplianceTable({
  criteria,
  compact = false,
}: ComplianceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <th className={compact ? "px-4 py-3" : "px-5 py-4"}>Criterio</th>
            <th className={compact ? "px-4 py-3" : "px-5 py-4"}>Calculado</th>
            <th className={compact ? "px-4 py-3" : "px-5 py-4"}>Límite</th>
            <th className={compact ? "px-4 py-3" : "px-5 py-4"}>Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {criteria.map((item) => {
            const status = statusContent[item.status];
            const StatusIcon = status.icon;

            return (
              <tr key={item.criterion} className="hover:bg-slate-50/70">
                <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                  {item.criterion}
                </td>
                <td className="px-5 py-4 font-mono text-sm text-slate-700">
                  {item.calculated}
                </td>
                <td className="px-5 py-4 font-mono text-sm text-slate-500">
                  {item.limit}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ring-1 ring-inset ${status.className}`}
                  >
                    <StatusIcon aria-hidden="true" size={13} />
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
