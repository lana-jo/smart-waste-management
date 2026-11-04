"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Shield, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import { subscribeUsers, getUsersSnapshot, reloadUsers, type UserItem } from "../lib/users-resource";
import { useAuth } from "../lib/auth-context";
import { UserModal } from "./user-modal";
import { UserTable } from "./user-table";

export default function UserManagementPage() {
  const { token, role, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { status, users, error } = useSyncExternalStore(
    subscribeUsers,
    getUsersSnapshot,
    getUsersSnapshot,
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<"admin" | "user">("user");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push("/login");
      return;
    }
    if (role !== "admin") return;
    void reloadUsers();
  }, [authLoading, token, role, router]);

  const openCreateModal = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setUserRole("user");
    setActionError(null);
    setShowModal(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setUserRole(user.role);
    setActionError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setActionError("Nama dan email wajib diisi.");
      return;
    }

    if (!editingUser && !password) {
      setActionError("Password wajib diisi untuk pengguna baru.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        const body: Record<string, unknown> = {
          name: trimmedName,
          email: trimmedEmail,
          role: userRole,
        };
        if (password) body.password = password;
        await apiFetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setSuccessMessage("Pengguna berhasil diperbarui.");
      } else {
        await apiFetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password, role: userRole }),
        });
        setSuccessMessage("Pengguna baru berhasil ditambahkan.");
      }
      closeModal();
      await reloadUsers();
      setSuccessMessage(editingUser ? "Pengguna berhasil diperbarui." : "Pengguna baru berhasil ditambahkan.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal menyimpan data pengguna.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}"?`)) return;
    setActionError(null);
    setSuccessMessage(null);
    try {
      await apiFetch(`/api/users/${userId}`, { method: "DELETE" });
      setSuccessMessage("Pengguna berhasil dihapus.");
      await reloadUsers();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal menghapus pengguna.");
    }
  };

  if (authLoading || (role === "admin" && users.length === 0 && status !== "ready")) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-stone-500 gap-2" role="status">
        <Loader2 className="animate-spin" size={20} />
        <span>Memuat manajemen pengguna...</span>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Shield size={24} />
        </div>
        <p className="text-sm text-rose-600 font-medium">Anda tidak memiliki akses ke halaman manajemen pengguna.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <p role="alert" className="text-sm text-rose-600 font-medium">{error}</p>
        <button
          type="button"
          onClick={() => void reloadUsers()}
          className="w-full px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Manajemen Pengguna</h1>
          <p className="text-sm text-stone-600 mt-1">Kelola akun pengguna, hak akses administrator, dan kredensial sistem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            <UserPlus size={16} />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {successMessage ? (
        <div role="status" className="fixed top-20 right-4 z-50 p-4 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-teal-700 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}
      {actionError ? (
        <div role="alert" className="fixed top-20 right-4 z-50 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      ) : null}

      <UserTable users={users} onEdit={openEditModal} onDelete={handleDeleteUser} />

      {users.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <Users size={24} />
          </div>
          <p className="text-base font-semibold text-stone-900">Belum ada pengguna terdaftar</p>
        </div>
      ) : null}

      <UserModal
        show={showModal}
        editingUser={editingUser}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        userRole={userRole}
        setUserRole={setUserRole}
        submitting={submitting}
        actionError={actionError}
        onClose={closeModal}
        onSave={handleSaveUser}
      />
    </div>
  );
}
