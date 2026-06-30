"use client";

import { useState } from "react";
import MemberCard from "./MemberCard";
import MemberForm from "./MemberForm";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useLibrary } from "@/context/LibraryContext";
import { useApp } from "@/context/AppContext";
import { useDebounce } from "@/hooks/useDebounce";
import { Member, MemberStatus, MemberType } from "@/types";

export default function MemberList() {
  const { state, addMember, updateMember, deleteMember, toggleMemberStatus } = useLibrary();
  const { addNotification } = useApp();

  const [searchRaw, setSearchRaw] = useState("");
  const search = useDebounce(searchRaw, 350);
  const [typeFilter, setTypeFilter] = useState<MemberType | "Semua">("Semua");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "Semua">("Semua");

  const [showAdd, setShowAdd] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  const filtered = state.members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nim.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q);
    const matchType = typeFilter === "Semua" || m.type === typeFilter;
    const matchStatus = statusFilter === "Semua" || m.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleAdd = (data: Omit<Member, "id" | "joinedAt" | "activeLoans">) => {
    addMember(data);
    setShowAdd(false);
    addNotification("Anggota berhasil ditambahkan!", "success");
  };

  const handleEdit = (data: Omit<Member, "id" | "joinedAt" | "activeLoans">) => {
    if (!editingMember) return;
    updateMember({ ...editingMember, ...data });
    setEditingMember(null);
    addNotification("Data anggota berhasil diperbarui!", "success");
  };

  const handleDelete = () => {
    if (!deletingMember) return;
    deleteMember(deletingMember.id);
    setDeletingMember(null);
    addNotification(`Anggota "${deletingMember.name}" berhasil dihapus.`, "info");
  };

  const handleToggle = (id: string) => {
    const member = state.members.find((m) => m.id === id);
    if (!member) return;
    toggleMemberStatus(id);
    const newStatus = member.status === "Aktif" ? "Nonaktif" : "Aktif";
    addNotification(`Status ${member.name} diubah ke ${newStatus}.`, "info");
  };

  const types: (MemberType | "Semua")[] = ["Semua", "Mahasiswa", "Dosen", "Staf", "Umum"];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={searchRaw}
          onChange={setSearchRaw}
          placeholder="Cari nama, NIM/NIP, email..."
          className="flex-1"
        />
        <Button variant="primary" icon="+" onClick={() => setShowAdd(true)} className="flex-shrink-0">
          Tambah Anggota
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-slate-500 text-xs">Jenis:</span>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t as MemberType | "Semua")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              typeFilter === t
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="text-slate-600 mx-1">|</span>
        {(["Semua", "Aktif", "Nonaktif"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as MemberStatus | "Semua")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === s
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="text-slate-500 text-xs">
        Menampilkan <span className="text-white font-semibold">{filtered.length}</span> dari{" "}
        {state.members.length} anggota
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">Tidak ada anggota ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={setEditingMember}
              onDelete={setDeletingMember}
              onToggleStatus={handleToggle}
            />
          ))}
        </div>
      )}

      {/* ADD Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah Anggota Baru" size="md">
        <MemberForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      {/* EDIT Modal */}
      <Modal isOpen={!!editingMember} onClose={() => setEditingMember(null)} title="Edit Data Anggota" size="md">
        <MemberForm
          initial={editingMember}
          onSubmit={handleEdit}
          onCancel={() => setEditingMember(null)}
        />
      </Modal>

      {/* DELETE Confirm */}
      <Modal
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        title="Hapus Anggota"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingMember(null)}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <p className="text-slate-300 text-sm">
          Apakah kamu yakin ingin menghapus anggota{" "}
          <strong className="text-white">&quot;{deletingMember?.name}&quot;</strong>?
        </p>
      </Modal>
    </div>
  );
}
