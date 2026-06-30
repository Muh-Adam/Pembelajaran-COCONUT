import Navbar from "@/components/layout/Navbar";
import MemberList from "@/components/members/MemberList";

export const metadata = {
  title: "Manajemen Anggota — LibraryMS",
  description: "Kelola data anggota perpustakaan: mahasiswa, dosen, staf, dan umum.",
};

export default function MembersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        title="Manajemen Anggota"
        subtitle="Data anggota perpustakaan"
      />
      <div className="flex-1 p-6">
        <MemberList />
      </div>
    </div>
  );
}
