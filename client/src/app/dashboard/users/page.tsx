"use client";

import { useEffect, useState } from "react";
import { useAuth, User } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserModal from "@/components/UserModal";
import { Plus, ArrowLeft, Loader2, Users } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "Admin") {
        router.push("/dashboard");
      } else {
        fetchUsers();
      }
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const { data } = await axios.get("http://localhost:5001/api/auth/users");
      setUsersList(data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    await axios.post("http://localhost:5001/api/auth/register", userData);
    await fetchUsers();
    setIsModalOpen(false);
  };

  const handleEditUser = async (userData: any) => {
    if (!currentUser) return;
    await axios.put(`http://localhost:5001/api/auth/users/${currentUser._id}`, userData);
    await fetchUsers();
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  if (loading || !user || user.role !== "Admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar (Minimal for subpage) */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide">Manage Users</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-slate-400 mt-1">Manage system access and roles.</p>
          </div>
          
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        {fetchingUsers ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
          </div>
        ) : usersList.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/20 rounded-3xl bg-white/5">
            <p className="text-slate-400">No users found.</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-sm uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-slate-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          u.role === 'Admin' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : u.role === 'Manager'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(u)}
                          className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreateUser : handleEditUser}
        initialData={currentUser}
        title={modalMode === "create" ? "Create New User" : "Edit User"}
      />
    </div>
  );
}
