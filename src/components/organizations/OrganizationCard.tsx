import { Link } from "react-router-dom";
import type { Organization } from "../../types/organization";
import { Input } from "../common/FormField";
import { Button } from "../Button";

export default function OrganizationCard({
  org,
  editing,
  editName,
  setEditName,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  org: Organization;
  editing: boolean;
  editName: string;
  setEditName: (v: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">
      {editing ? (
        <div className="space-y-3">
          <Input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={onSave}>Save</Button>
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
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-lg">
                ⌘
              </div>
              <div className="min-w-0">
                <Link
                  to={`/organizations/${org._id}`}
                  className="block truncate font-semibold text-white hover:text-cyan-300"
                >
                  {org.name}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  Software workspace
                </p>
              </div>
            </div>
            <Link
              to={`/organizations/${org._id}`}
              className="text-xs font-semibold text-cyan-400 opacity-0 transition group-hover:opacity-100"
            >
              Open →
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
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
              to={`/organizations/${org._id}`}
              className="ml-auto rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/15"
            >
              View Projects →
            </Link>
          </div>
        </>
      )}
    </article>
  );
}
