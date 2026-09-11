import { Link } from "react-router-dom";
import type { Requirement, RequirementStatus } from "../../types/organization";
import { Input, Textarea } from "../common/FormField";
const statusClass: Record<RequirementStatus, string> = {
  draft: "bg-slate-800 text-slate-300",
  approved: "bg-blue-500/10 text-blue-300",
  in_progress: "bg-amber-500/10 text-amber-300",
  done: "bg-emerald-500/10 text-emerald-300",
};
type Props = {
  req: Requirement;
  orgId: string;
  projectId: string;
  editing: boolean;
  editTitle: string;
  editDescription: string;
  editStatus: RequirementStatus;
  setEditTitle: (v: string) => void;
  setEditDescription: (v: string) => void;
  setEditStatus: (v: RequirementStatus) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onGenerate: () => void;
  generating: boolean;
};
export default function RequirementCard({
  req,
  orgId,
  projectId,
  editing,
  editTitle,
  editDescription,
  editStatus,
  setEditTitle,
  setEditDescription,
  setEditStatus,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onGenerate,
  generating,
}: Props) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      {editing ? (
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="min-h-24"
          />
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as RequirementStatus)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
          >
            <option value="draft">draft</option>
            <option value="approved">approved</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/organizations/${orgId}/projects/${projectId}/requirements/${req._id}`}
                  className="text-lg font-semibold text-white hover:text-cyan-300"
                >
                  {req.title}
                </Link>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusClass[req.status]}`}
                >
                  {req.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {req.description}
              </p>
            </div>
            <button
              onClick={onGenerate}
              disabled={generating}
              className="shrink-0 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/15 disabled:opacity-50"
            >
              {generating ? "Generating..." : "✦ Generate Stories"}
            </button>
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
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-300"
            >
              Delete
            </button>
            <Link
              to={`/organizations/${orgId}/projects/${projectId}/requirements/${req._id}`}
              className="ml-auto text-xs font-semibold text-cyan-300"
            >
              View stories →
            </Link>
          </div>
        </>
      )}
    </article>
  );
}
