import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "../api/organizationApi";
import type { Organization } from "../types/organization";
import AppNavbar from "../components/layout/AppNavbar";
import PageContainer from "../components/layout/PageContainer";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { Input } from "../components/common/FormField";
import OrganizationCard from "../components/organizations/OrganizationCard";
import ConfirmModal from "../components/ConfirmModal";

import { useToast } from "../context/ToastContext";

export default function Dashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Tracks which org is pending delete confirmation — null means modal is closed
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);

  const { showToast } = useToast();

  const loadOrganizations = useCallback(async () => {
    try {
      setError("");
      setOrganizations(await getOrganizations());
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      await createOrganization(newOrgName.trim());
      setNewOrgName("");
      await loadOrganizations();
      showToast("Organization created");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to create organization",
        "error",
      );
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateOrganization(id, editName.trim());
      setEditingId(null);
      setEditName("");
      await loadOrganizations();
      showToast("Organization updated");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to update organization",
        "error",
      );
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOrganization(deleteTarget._id);
      await loadOrganizations();
      showToast("Organization deleted");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to delete organization",
        "error",
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <AppNavbar />
        <PageContainer>
          <Loading label="Loading your organizations..." />
        </PageContainer>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNavbar />
      <PageContainer>
        {/* ... your hero section and stats grid stay exactly as they are ... */}

        <section className="rounded-3xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Workspace
                </p>
                <h2 className="mt-1 text-xl font-bold">Your organizations</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create and manage your software development workspaces.
                </p>
              </div>
              <form
                onSubmit={handleCreate}
                className="flex w-full gap-2 sm:w-auto"
              >
                <Input
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Organization name"
                  className="sm:w-56"
                />
                <button className="whitespace-nowrap rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300">
                  + Create
                </button>
              </form>
            </div>
          </div>
          <div className="p-6">
            <ErrorMessage message={error ?? ""} />
            {organizations.length === 0 ? (
              <EmptyState
                icon="⌘"
                title="No organizations yet"
                description="Create your first organization to start managing projects, requirements and AI-powered development workflows."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {organizations.map((org) => (
                  <OrganizationCard
                    key={org._id}
                    org={org}
                    editing={editingId === org._id}
                    editName={editName}
                    setEditName={setEditName}
                    onEdit={() => {
                      setEditingId(org._id);
                      setEditName(org.name);
                    }}
                    onSave={() => handleUpdate(org._id)}
                    onCancel={() => {
                      setEditingId(null);
                      setEditName("");
                    }}
                    onDelete={() => setDeleteTarget(org)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-slate-600">
          AI-SDLC Platform • Build smarter with AI
        </footer>
      </PageContainer>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete organization"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
