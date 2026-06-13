import { Pencil, Trash2 } from "lucide-react";
import { UserRole } from "@/context/AuthContext";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: { name: string; email: string };
  assignedTo?: { name: string; email: string };
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  userRole: UserRole;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, userRole, onEdit, onDelete }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-white leading-tight">{task.title}</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(task.status)} whitespace-nowrap ml-3`}>
          {task.status}
        </span>
      </div>
      
      <p className="text-slate-400 text-sm flex-grow mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          <div className="mb-1">
            <span className="font-medium text-slate-400">Assigned:</span> {task.assignedTo?.name || "Unassigned"}
          </div>
          <div>
            <span className="font-medium text-slate-400">Created by:</span> {task.createdBy?.name || "Unknown"}
          </div>
        </div>
        
        <div className="flex gap-2">
          {(userRole === "Admin" || userRole === "Manager") && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Pencil size={16} />
            </button>
          )}
          {userRole === "Admin" && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
