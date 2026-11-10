"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { apiFetch } from "../lib/api";
import { subscribeUsers, getUsersSnapshot, reloadUsers, type UserItem } from "../lib/users-resource";
import { useAuth } from "../lib/auth-context";
import { useToast } from "../components/toast";
import { UserModal } from "./user-modal";
import { UserTable } from "./user-table";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { UserGuards } from "./user-guards";
import { UserFilters } from "./user-filters";
import { UserSearch } from "./user-search";
import { UserEmptyState } from "./user-empty-state";

export default function UserManagementPage() {
  const { user, token, role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const { status, users, error } = useSyncExternalStore(
    subscribeUsers,
    getUsersSnapshot,
    getUsersSnapshot,
  );

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
  };

  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();
    setActionError(null);

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
        closeModal();
        await reloadUsers(statusFilter !== "active");
        showToast("success", "Pengguna berhasil diperbarui.");
      } else {
        await apiFetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password, role: userRole }),
        });
        closeModal();
        await reloadUsers(statusFilter !== "active");
        showToast("success", "Pengguna baru berhasil ditambahkan.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan data pengguna.";
      setActionError(message);
      showToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeletingUser({ id: userId, name: userName });
    setActionError(null);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser || isDeleting) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await apiFetch(`/api/users/${deletingUser.id}`, { method: "DELETE" });
      showToast("success", "Pengguna berhasil dinonaktifkan.");
      setDeletingUser(null);
      await reloadUsers(statusFilter !== "active");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Gagal menghapus pengguna.");
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
    onReload: () => void reloadUsers(statusFilter !== "active"),
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
        <div className="flex w-full sm:w-auto items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="flex w-full sm:w-auto min-h-11 justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
          >
            <UserPlus size={16} aria-hidden="true" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center">
        <UserSearch value={searchQuery} onChange={setSearchQuery} />
        <UserFilters currentFilter={statusFilter} onFilterChange={setStatusFilter} />
      </div>

      <UserTable users={filteredUsers} currentUserId={user?.id} onEdit={openEditModal} onDelete={handleDeleteUser} />

      {filteredUsers.length === 0 ? (
        <UserEmptyState statusFilter={statusFilter} searchQuery={searchQuery} />
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
