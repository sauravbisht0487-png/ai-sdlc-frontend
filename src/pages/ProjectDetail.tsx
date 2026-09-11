import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRequirements,
  createRequirement,
  generateStories,
  updateRequirement,
  deleteRequirement,
} from "../api/requirementApi";
import { createGithubRepo } from "../api/projectApi";
import type { Requirement, RequirementStatus } from "../types/organization";
import AppNavbar from "../components/layout/AppNavbar";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import BackButton from "../components/layout/BackButton";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { Input, Textarea } from "../components/common/FormField";
import RequirementCard from "../components/requirements/RequirementCard";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

export default function ProjectDetail() {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<RequirementStatus>("draft");
  const [deleteTarget, setDeleteTarget] = useState<Requirement | null>(null);

  const { showToast } = useToast();

  const load = async () => {
    if (!orgId || !projectId) return;
    try {
      setError("");
      setRequirements(await getRequirements(orgId, projectId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load requirements");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [orgId, projectId]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !projectId || !title.trim() || !description.trim()) return;
    try {
      await createRequirement(orgId, projectId, title.trim(), description.trim());
      setTitle("");
      setDescription("");
      await load();
      showToast("Requirement created");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create requirement", "error");
    }
  };

  const gen = async (id: string) => {
    if (!orgId || !projectId) return;
    setGeneratingFor(id);
    try {
      await generateStories(orgId, projectId, id);
      showToast("User stories generated! View them on this requirement's page.");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to generate stories", "error");
    } finally {
      setGeneratingFor(null);
    }
  };

  const repo = async () => {
    if (!orgId || !projectId) return;
    try {
      await createGithubRepo(orgId, projectId);
      showToast("GitHub repo created!");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create GitHub repo", "error");
    }
  };

  const edit = (r: Requirement) => {
    setEditingId(r._id);
    setEditTitle(r.title);
    setEditDescription(r.description);
    setEditStatus(r.status);
  };

  const save = async (id: string) => {
    if (!orgId || !projectId || !editTitle.trim() || !editDescription.trim()) return;
    try {
      await updateRequirement(orgId, projectId, id, editTitle.trim(), editDescription.trim(), editStatus);
      setEditingId(null);
      await load();
      showToast("Requirement updated");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update requirement", "error");
    }
  };

  const removeConfirmed = async () => {
    if (!orgId || !projectId || !deleteTarget) return;
    try {
      await deleteRequirement(orgId, projectId, deleteTarget._id);
      await load();
      showToast("Requirement deleted");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete requirement", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950">
        <AppNavbar />
        <PageContainer>
          <Loading label="Loading requirements..." />
        </PageContainer>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNavbar />
      <PageContainer>
        <BackButton to={`/organizations/${orgId}`} label="Back to Projects" />
        <PageHeader
          eyebrow="Project workspace"
          title="Requirements"
          description="Define product requirements, then use AI to turn them into actionable user stories."
          actions={
            <button
              onClick={repo}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-400/40 hover:text-cyan-300"
            >
              ↗ Create GitHub Repo
            </button>
          }
        />
        <ErrorMessage message={error} />
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              New requirement
            </p>
            <h2 className="mt-1 text-lg font-bold">Capture what needs to be built</h2>
          </div>
          <form onSubmit={create} className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Requirement title"
              required
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the requirement in plain English"
              className="min-h-28"
              required
            />
            <button className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300">
              Create Requirement
            </button>
          </form>
        </section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Requirements</h2>
            <p className="text-xs text-slate-500">
              {requirements.length} requirement{requirements.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {requirements.length === 0 ? (
          <EmptyState
            title="No requirements yet"
            description="Create your first requirement above. Once created, you can generate user stories with AI."
          />
        ) : (
          <div className="space-y-4">
            {requirements.map((req) => (
              <RequirementCard
                key={req._id}
                req={req}
                orgId={orgId!}
                projectId={projectId!}
                editing={editingId === req._id}
                editTitle={editTitle}
                editDescription={editDescription}
                editStatus={editStatus}
                setEditTitle={setEditTitle}
                setEditDescription={setEditDescription}
                setEditStatus={setEditStatus}
                onEdit={() => edit(req)}
                onSave={() => save(req._id)}
                onCancel={() => setEditingId(null)}
                onDelete={() => setDeleteTarget(req)}
                onGenerate={() => gen(req._id)}
                generating={generatingFor === req._id}
              />
            ))}
          </div>
        )}
      </PageContainer>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete requirement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={removeConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}