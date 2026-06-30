import { Budget } from "@/types";
import { formatIDR } from "@/utils/format";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (b: Budget) => void;
  onDelete: (b: Budget) => void;
}

// BudgetProgress — sub-component (props drilling demo: BudgetCard → BudgetProgress)
interface BudgetProgressProps {
  spent: number;
  limit: number;
}
function BudgetProgress({ spent, limit }: BudgetProgressProps) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOver = spent > limit;
  const isDanger = pct >= 80;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400">Terpakai</span>
        <span className={`font-semibold ${isOver ? "text-red-400" : isDanger ? "text-amber-400" : "text-emerald-400"}`}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isOver ? "bg-red-500" : isDanger ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-xs">
        <span className="text-slate-500">{formatIDR(spent)} digunakan</span>
        <span className="text-slate-500">Sisa: {formatIDR(Math.max(0, limit - spent))}</span>
      </div>
    </div>
  );
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const pct = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
  const isOver = budget.spent > budget.limit;
  const isDanger = pct >= 80 && !isOver;

  return (
    <div className={`bg-slate-900/80 border rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${isOver ? "border-red-500/40" : isDanger ? "border-amber-500/40" : "border-slate-800"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-white font-semibold text-sm">{budget.category}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-500">{budget.period}</span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-500">{budget.month}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold text-sm">{formatIDR(budget.limit)}</p>
          <p className="text-slate-600 text-[10px]">limit</p>
        </div>
      </div>

      {/* Props drilling: BudgetCard → BudgetProgress */}
      <BudgetProgress spent={budget.spent} limit={budget.limit} />

      {/* Status badge */}
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOver ? "bg-red-500/15 text-red-400 border border-red-500/30" : isDanger ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"}`}>
          {isOver ? "⚠ Melebihi Batas" : isDanger ? "⚡ Hampir Habis" : "✓ Aman"}
        </span>
        {budget.notes && <p className="text-slate-600 text-[10px] truncate max-w-24">{budget.notes}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-800">
        <button onClick={() => onEdit(budget)} className="flex-1 py-1.5 text-xs text-blue-400 hover:bg-blue-500/15 rounded-lg transition-colors cursor-pointer">Edit</button>
        <button onClick={() => onDelete(budget)} className="flex-1 py-1.5 text-xs text-red-400 hover:bg-red-500/15 rounded-lg transition-colors cursor-pointer">Hapus</button>
      </div>
    </div>
  );
}
