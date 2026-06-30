import Badge from "@/components/ui/Badge";
import { Member, MemberStatus, MemberType } from "@/types";

export const memberTypeBadge: Record<MemberType, "blue" | "purple" | "cyan" | "orange"> = {
  Mahasiswa: "blue",
  Dosen: "purple",
  Staf: "cyan",
  Umum: "orange",
};

export const memberTypeIcon: Record<MemberType, string> = {
  Mahasiswa: "🎓",
  Dosen: "👨‍🏫",
  Staf: "💼",
  Umum: "👤",
};

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onToggleStatus: (id: string) => void;
}

export default function MemberCard({ member, onEdit, onDelete, onToggleStatus }: MemberCardProps) {
  const isActive = member.status === "Aktif";

  return (
    <div
      className={`bg-slate-800/60 border rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 ${
        isActive ? "border-slate-700/50 hover:border-slate-600" : "border-slate-700/30 opacity-70"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xl flex-shrink-0">
          {memberTypeIcon[member.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{member.name}</p>
          <p className="text-slate-500 text-xs font-mono truncate">{member.nim}</p>
        </div>
        {/* Status badge */}
        <Badge variant={isActive ? "green" : "slate"} dot>
          {member.status}
        </Badge>
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">✉</span>
          <span className="text-slate-400 truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">📞</span>
          <span className="text-slate-400">{member.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">📅</span>
          <span className="text-slate-400">
            Bergabung {new Date(member.joinedAt).toLocaleDateString("id-ID")}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge variant={memberTypeBadge[member.type]}>{member.type}</Badge>
        {member.activeLoans > 0 && (
          <Badge variant="blue">{member.activeLoans} pinjaman aktif</Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 pt-3 border-t border-slate-700/50">
        <button
          onClick={() => onToggleStatus(member.id)}
          className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
            isActive
              ? "text-amber-400 hover:bg-amber-500/20"
              : "text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          {isActive ? "Nonaktifkan" : "Aktifkan"}
        </button>
        <button
          onClick={() => onEdit(member)}
          className="flex-1 py-1.5 text-xs text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(member)}
          disabled={member.activeLoans > 0}
          className="flex-1 py-1.5 text-xs text-red-400 hover:bg-red-600/20 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title={member.activeLoans > 0 ? "Selesaikan peminjaman terlebih dahulu" : ""}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
