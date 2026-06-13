import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

import { User } from "@/context/AuthContext";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => Promise<void>;
  initialData?: any;
  title: string;
  usersList?: User[];
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData, title, usersList }: TaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTaskTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "Pending");
      setAssignedTo(initialData.assignedTo?._id || initialData.assignedTo || "");
    } else {
      setTaskTitle("");
      setDescription("");
      setStatus("Pending");
      setAssignedTo("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data: any = { title: taskTitle, description, status };
    if (assignedTo) {
      data.assignedTo = assignedTo;
    }
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Task Title</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder:text-slate-500"
              placeholder="e.g., Update Marketing Materials"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder:text-slate-500 resize-none"
              placeholder="Detailed description of the task..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white appearance-none"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {usersList && usersList.length > 0 && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white appearance-none"
              >
                <option value="">-- Assign to User --</option>
                {usersList.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
