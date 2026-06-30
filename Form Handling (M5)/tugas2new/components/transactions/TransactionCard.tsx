import Badge from "@/components/ui/Badge";
import { Transaction, TransactionType } from "@/types";
import { formatIDR, formatDate } from "@/utils/format";

// Category → display data
export const categoryConfig: Record<string, { icon: string; color: "emerald" | "blue" | "red" | "amber" | "purple" | "cyan" | "slate" | "rose" | "teal" }> = {
  "Gaji": { icon: "💼", color: "emerald" },
  "Bonus": { icon: "🎁", color: "emerald" },
  "Investasi": { icon: "📈", color: "teal" },
  "Penjualan": { icon: "🛒", color: "blue" },
  "Hadiah": { icon: "🎀", color: "purple" },
  "Lainnya Masuk": { icon: "➕", color: "slate" },
  "Makanan & Minuman": { icon: "🍜", color: "amber" },
  "Transportasi": { icon: "🚗", color: "blue" },
  "Belanja": { icon: "🛍️", color: "purple" },
  "Kesehatan": { icon: "🏥", color: "rose" },
  "Hiburan": { icon: "🎬", color: "cyan" },
  "Pendidikan": { icon: "📚", color: "blue" },
  "Tagihan & Utilitas": { icon: "⚡", color: "amber" },
  "Tabungan": { icon: "🏦", color: "teal" },
  "Lainnya Keluar": { icon: "➖", color: "slate" },
};

// AmountDisplay — sub-component (props drilling: TransactionCard → AmountDisplay)
interface AmountDisplayProps {
  amount: number;
  type: TransactionType;
}
export function AmountDisplay({ amount, type }: AmountDisplayProps) {
  const isIncome = type === "Pemasukan";
  const isTransfer = type === "Transfer";
  return (
    <div className="text-right flex-shrink-0">
      <p className={`font-bold text-sm ${isIncome ? "text-emerald-400" : isTransfer ? "text-blue-400" : "text-red-400"}`}>
        {isIncome ? "+" : isTransfer ? "⇄" : "−"}{formatIDR(amount)}
      </p>
      <p className="text-slate-600 text-[10px] capitalize">{type}</p>
    </div>
  );
}

interface TransactionCardProps {
  transaction: Transaction;
  accountName: string;
  toAccountName?: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export default function TransactionCard({
  transaction, accountName, toAccountName, onEdit, onDelete
}: TransactionCardProps) {
  const cat = categoryConfig[transaction.category] ?? { icon: "💸", color: "slate" as const };

  return (
    <div className="flex items-center gap-3 p-3.5 bg-slate-900/60 border border-slate-800/60 rounded-xl hover:border-slate-700 transition-all duration-150 group">
      {/* Category icon */}
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
        {cat.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-white text-sm font-medium truncate">{transaction.description || transaction.category}</p>
          <Badge variant={cat.color} className="hidden sm:inline-flex">{transaction.category}</Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span>{formatDate(transaction.date)}</span>
          <span>·</span>
          <span>{accountName}{toAccountName ? ` → ${toAccountName}` : ""}</span>
          {transaction.tags.length > 0 && (
            <span className="text-slate-600">#{transaction.tags[0]}</span>
          )}
        </div>
      </div>

      {/* Props drilling: TransactionCard → AmountDisplay */}
      <AmountDisplay amount={transaction.amount} type={transaction.type} />

      {/* Actions — visible on hover */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(transaction)}
          className="w-7 h-7 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer text-xs"
        >✎</button>
        <button
          onClick={() => onDelete(transaction)}
          className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer text-xs"
        >✕</button>
      </div>
    </div>
  );
}
