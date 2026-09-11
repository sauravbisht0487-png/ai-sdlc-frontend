import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectApi";
import type { Project } from "../types/organization";
import AppNavbar from "../components/layout/AppNavbar";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import BackButton from "../components/layout/BackButton";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { Input } from "../components/common/FormField";
import ProjectCard from "../components/projects/ProjectCard";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

export default function OrganizationDetail() {
  const { orgId } = useParams<{ orgId: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const { showToast } = useToast();

  const load = async () => {
    if (!orgId) return;
    try {
      setError("");
      setProjects(await getProjects(orgId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [orgId]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !newProjectName.trim()) return;
    try {
      await createProject(orgId, newProjectName.trim());
      setNewProjectName("");
      await load();
      showToast("Project created");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create project", "error");
    }
  };

  const save = async (id: string) => {
    if (!orgId || !editName.trim()) return;
    try {
      await updateProject(orgId, id, editName.trim(), editDescription.trim());
      setEditingId(null);
      await load();
      showToast("Project updated");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update project", "error");
    }
  };

  const removeConfirmed = async () => {
    if (!orgId || !deleteTarget) return;
    try {
      await deleteProject(orgId, deleteTarget._id);
      await load();
      showToast("Project deleted");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete project", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950">
        <AppNavbar />
        <PageContainer>
          <Loading label="Loading projects..." />
        </PageContainer>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNavbar />
      <PageContainer>
        <BackButton to="/dashboard" label="Back to Organizations" />
        <PageHeader
          eyebrow="Organization workspace"
          title="Projects"
          description="Turn this organization into focused projects, then define requirements inside each project."
          actions={
            <form onSubmit={create} className="flex w-full gap-2 sm:w-auto">
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="New project name"
                className="sm:w-64"
              />
              <button className="whitespace-nowrap rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950">
                + Project
              </button>
            </form>
          }
        />
        <ErrorMessage message={error} />
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create a project to start capturing requirements and moving through the AI-SDLC workflow."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                orgId={orgId!}
                editing={editingId === project._id}
                editName={editName}
                editDescription={editDescription}
                setEditName={setEditName}
                setEditDescription={setEditDescription}
                onEdit={() => {
                  setEditingId(project._id);
                  setEditName(project.name);
                  setEditDescription(project.description || "");
                }}
                onSave={() => save(project._id)}
                onCancel={() => setEditingId(null)}
                onDelete={() => setDeleteTarget(project)}
              />
            ))}
          </div>
        )}
      </PageContainer>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={removeConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}