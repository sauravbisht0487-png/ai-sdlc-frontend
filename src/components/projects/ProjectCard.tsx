import { Link } from "react-router-dom";
import { Input, Textarea } from "../common/FormField";
import type { Project } from "../../types/organization";

type Props = {
  project: Project;
  orgId: string;
  editing: boolean;
  editName: string;
  editDescription: string;
  setEditName: (value: string) => void;
  setEditDescription: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

export default function ProjectCard({
  project,
  orgId,
  editing,
  editName,
  editDescription,
  setEditName,
  setEditDescription,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">
      {editing ? (
        <div className="space-y-3">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Project description"
            className="min-h-24"
          />
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                to={`/organizations/${orgId}/projects/${project._id}`}
                className="block truncate text-lg font-semibold text-white hover:text-cyan-300"
              >
                {project.name}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {project.description || "No description added yet."}
              </p>
            </div>
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              Project
            </span>
          </div>
          <div className="mt-5 flex gap-2 border-t border-slate-800 pt-4">
            <button
              onClick={onEdit}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
            >
              Delete
            </button>
            <Link
              to={`/organizations/${orgId}/projects/${project._id}`}
              className="ml-auto text-xs font-semibold text-cyan-300"
            >
              Open project →
            </Link>
          </div>
        </>
      )}
    </article>
  );
}
