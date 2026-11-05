"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import { subscribeUsers, getUsersSnapshot, reloadUsers, type UserItem } from "../lib/users-resource";
import { useAuth } from "../lib/auth-context";
import { UserModal } from "./user-modal";
import { UserTable } from "./user-table";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { UserGuards } from "./user-guards";
import { UserFilters } from "./user-filters";
import { UserSearch } from "./user-search";

export default function UserManagementPage() {
  const { user, token, role, isLoading: authLoading } = useAuth();
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

  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<"admin" | "user">("user");
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push("/login");
      return;
    }
    if (role !== "admin") return;
    void reloadUsers(statusFilter !== "active");
  }, [authLoading, token, role, router, statusFilter]);

  const openCreateModal = () => {
    setEditingUser(null);
    setName(""); setEmail(""); setPassword("");
    setUserRole("user");
    setActionError(null);
    setShowModal(true);
  };

  const openEditModal = (userItem: UserItem) => {
    setEditingUser(userItem);
    setName(userItem.name); setEmail(userItem.email);
    setPassword("");
    setUserRole(userItem.role);
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
      await reloadUsers(statusFilter !== "active");
      setSuccessMessage(editingUser ? "Pengguna berhasil diperbarui." : "Pengguna baru berhasil ditambahkan.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal menyimpan data pengguna.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeletingUser({ id: userId, name: userName });
    setActionError(null);
    setSuccessMessage(null);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    setActionError(null);
    setSuccessMessage(null);
    try {
      await apiFetch(`/api/users/${deletingUser.id}`, { method: "DELETE" });
      setSuccessMessage("Pengguna berhasil dinonaktifkan.");
      setDeletingUser(null);
      await reloadUsers(statusFilter !== "active");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal menghapus pengguna.");
    } finally {
      setIsDeleting(false);
    }
  };

  const guardResult = UserGuards({
    authLoading,
    role,
    usersCount: users.length,
    status,
    error,
    onReload: () => void reloadUsers(),
  });

  if (guardResult) return guardResult;

  const filteredUsers = users.filter((u) => {
    if (statusFilter === "active" && u.is_deleted) return false;
    if (statusFilter === "inactive" && !u.is_deleted) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = u.name.toLowerCase().includes(q);
      const emailMatch = u.email.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch) return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Manajemen Pengguna</h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Kelola akun pengguna, hak akses administrator, dan kredensial sistem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
          >
            <UserPlus size={16} />
            Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <UserSearch value={searchQuery} onChange={setSearchQuery} />
        <UserFilters currentFilter={statusFilter} onFilterChange={setStatusFilter} />
      </div>

      {successMessage ? (
        <div role="status" className="fixed top-20 right-4 z-50 p-4 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-teal-700 dark:text-teal-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}
      {actionError ? (
        <div role="alert" className="fixed top-20 right-4 z-50 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      ) : null}

      <UserTable users={filteredUsers} currentUserId={user?.id} onEdit={openEditModal} onDelete={handleDeleteUser} />

      {filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center mx-auto">
            <Users size={24} />
          </div>
          <p className="text-base font-semibold text-stone-900 dark:text-stone-100">Belum ada pengguna terdaftar</p>
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

      <DeleteConfirmationModal
        show={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
        onConfirm={confirmDeleteUser}
        userName={deletingUser?.name ?? ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
