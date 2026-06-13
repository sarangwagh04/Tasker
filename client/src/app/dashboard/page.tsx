"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Plus, LogOut, Loader2, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [fetchingTasks, setFetchingTasks] = useState(true);
  const [usersList, setUsersList] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentTask, setCurrentTask] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      if (user.role === "Admin" || user.role === "Manager") {
        fetchUsersList();
      }
    }
  }, [user]);

  const fetchUsersList = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/auth/users");
      setUsersList(data);
    } catch (error) {
      console.error("Error fetching users list", error);
    }
  };

  const fetchTasks = async () => {
    setFetchingTasks(true);
    try {
      const { data } = await axios.get("http://localhost:5001/api/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setFetchingTasks(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await axios.post("http://localhost:5001/api/tasks", taskData);
      fetchTasks();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating task", error);
      const message = error.response?.data?.message || "Failed to create task. Only Admins can create tasks.";
      alert(message);
    }
  };

  const handleEditTask = async (taskData: any) => {
    try {
      await axios.put(`http://localhost:5001/api/tasks/${currentTask._id}`, taskData);
      fetchTasks();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error updating task", error);
      const message = error.response?.data?.message || "Failed to update task.";
      alert(message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${id}`);
      fetchTasks();
    } catch (error: any) {
      console.error("Error deleting task", error);
      const message = error.response?.data?.message || "Failed to delete task. Only Admins can delete tasks.";
      alert(message);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: any) => {
    setModalMode("edit");
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide hidden sm:block">TaskManager</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">{user.role}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your team's tasks efficiently.</p>
          </div>
          
          {user.role === "Admin" && (
            <div className="flex gap-3">
              <Link
                href="/dashboard/users"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
              >
                <Users size={18} />
                Manage Users
              </Link>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25"
              >
                <Plus size={18} />
                New Task
              </button>
            </div>
          )}
        </div>

        {fetchingTasks ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/20 rounded-3xl bg-white/5">
            <p className="text-slate-400">No tasks found. {user.role === "Admin" && "Create one to get started!"}</p>
          </div>
        ) : (user.role === "Admin" || user.role === "Manager") ? (
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                My Assigned Tasks
              </h2>
              {tasks.filter(t => t.assignedTo?._id === user._id || t.assignedTo === user._id).length === 0 ? (
                <p className="text-slate-400 italic">You have no tasks assigned to you right now.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.filter(t => t.assignedTo?._id === user._id || t.assignedTo === user._id).map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      userRole={user.role}
                      onEdit={openEditModal}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                All Tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    userRole={user.role}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                userRole={user.role}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreateTask : handleEditTask}
        initialData={currentTask}
        title={modalMode === "create" ? "Create New Task" : "Edit Task"}
        usersList={usersList}
      />
    </div>
  );
}
