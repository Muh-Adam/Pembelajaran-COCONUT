import Badge from "@/components/ui/Badge";
import { Account, AccountColor } from "@/types";
import { formatIDR } from "@/utils/format";

export const accountColorMap: Record<AccountColor, { badge: "emerald" | "blue" | "amber" | "purple" | "cyan" | "rose"; bg: string; border: string; glow: string }> = {
  emerald: { badge: "emerald", bg: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/30", glow: "shadow-emerald-500/10" },
  blue: { badge: "blue", bg: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/30", glow: "shadow-blue-500/10" },
  amber: { badge: "amber", bg: "from-amber-600/20 to-amber-500/5", border: "border-amber-500/30", glow: "shadow-amber-500/10" },
  purple: { badge: "purple", bg: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/30", glow: "shadow-purple-500/10" },
  cyan: { badge: "cyan", bg: "from-cyan-600/20 to-cyan-500/5", border: "border-cyan-500/30", glow: "shadow-cyan-500/10" },
  rose: { badge: "rose", bg: "from-rose-600/20 to-rose-500/5", border: "border-rose-500/30", glow: "shadow-rose-500/10" },
};

interface AccountCardProps {
  account: Account;
  onEdit: (acc: Account) => void;
  onDelete: (acc: Account) => void;
  onSetDefault: (id: string) => void;
  // Props drilling: AccountList → AccountCard → AccountBalance (nested)
  transactionCount: number;
}

// AccountBalance — sub-component receiving props (props drilling demo)
function AccountBalance({ balance, color }: { balance: number; color: AccountColor }) {
  const c = accountColorMap[color];
  return (
    <div className={`mt-3 p-3 rounded-xl bg-gradient-to-br ${c.bg} border ${c.border}`}>
      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Saldo</p>
      <p className={`text-xl font-bold text-white`}>{formatIDR(balance)}</p>
    </div>
  );
}

export default function AccountCard({ account, onEdit, onDelete, onSetDefault, transactionCount }: AccountCardProps) {
  const c = accountColorMap[account.color];

  return (
    <div className={`bg-slate-900/80 border ${c.border} rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-black/20`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} border ${c.border} flex items-center justify-center text-xl flex-shrink-0`}>
          {account.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-semibold text-sm truncate">{account.name}</p>
            {account.isDefault && (
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                Default
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-0.5">{account.type}</p>
        </div>
      </div>

      {/* Props drilling: AccountCard → AccountBalance */}
      <AccountBalance balance={account.balance} color={account.color} />

      {account.description && (
        <p className="text-slate-500 text-xs mt-2 line-clamp-1">{account.description}</p>
      )}

      <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
        <span>{transactionCount} transaksi</span>
        <span>Dibuat {new Date(account.createdAt).toLocaleDateString("id-ID")}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-800">
        {!account.isDefault && (
          <button
            onClick={() => onSetDefault(account.id)}
            className="flex-1 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/15 rounded-lg transition-colors cursor-pointer"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onEdit(account)}
          className="flex-1 py-1.5 text-xs text-blue-400 hover:bg-blue-500/15 rounded-lg transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(account)}
          disabled={account.isDefault}
          className="flex-1 py-1.5 text-xs text-red-400 hover:bg-red-500/15 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title={account.isDefault ? "Tidak dapat menghapus rekening default" : ""}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
