import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getUserStories,
  generateCode,
  pushToGithub,
  updateUserStory,
  deleteUserStory,
} from "../api/userStoryApi";
import type { UserStory, GeneratedCode } from "../types/organization";
import AppNavbar from "../components/layout/AppNavbar";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import BackButton from "../components/layout/BackButton";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { Input, Textarea } from "../components/common/FormField";
import GeneratedCodePanel from "../components/userStories/GeneratedCodePanel";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

export default function RequirementDetail() {
  const { orgId, projectId, requirementId } = useParams<{
    orgId: string;
    projectId: string;
    requirementId: string;
  }>();
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingCodeFor, setGeneratingCodeFor] = useState<string | null>(null);
  const [pushingFor, setPushingFor] = useState<string | null>(null);
  const [generatedByStory, setGeneratedByStory] = useState<Record<string, GeneratedCode>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCriteria, setEditCriteria] = useState("");
  const [generatingAll, setGeneratingAll] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserStory | null>(null);

  const { showToast } = useToast();

  const load = async () => {
    if (!orgId || !projectId || !requirementId) return;
    try {
      setError("");
      setStories(await getUserStories(orgId, projectId, requirementId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load user stories");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [orgId, projectId, requirementId]);

  const gen = async (id: string) => {
    if (!orgId || !projectId || !requirementId) return;
    setGeneratingCodeFor(id);
    try {
      const result = await generateCode(orgId, projectId, requirementId, id);
      setGeneratedByStory((p) => ({ ...p, [id]: result }));
      showToast("Code generated");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to generate code", "error");
    } finally {
      setGeneratingCodeFor(null);
    }
  };

  const push = async (id: string) => {
    if (!orgId || !projectId || !requirementId) return;
    const generated = generatedByStory[id];
    if (!generated) return;
    setPushingFor(id);
    try {
      await pushToGithub(orgId, projectId, requirementId, generated._id);
      showToast("Code pushed to GitHub");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to push to GitHub", "error");
    } finally {
      setPushingFor(null);
    }
  };

  const edit = (s: UserStory) => {
    setEditingId(s._id);
    setEditTitle(s.title);
    setEditDescription(s.description);
    setEditCriteria(s.acceptanceCriteria.join(", "));
  };

  const save = async (id: string) => {
    if (!orgId || !projectId || !requirementId || !editTitle.trim() || !editDescription.trim()) return;
    try {
      await updateUserStory(
        orgId,
        projectId,
        requirementId,
        id,
        editTitle.trim(),
        editDescription.trim(),
        editCriteria.split(",").map((x) => x.trim()).filter(Boolean),
      );
      setEditingId(null);
      await load();
      showToast("User story updated");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update user story", "error");
    }
  };

  const removeConfirmed = async () => {
    if (!orgId || !projectId || !requirementId || !deleteTarget) return;
    try {
      await deleteUserStory(orgId, projectId, requirementId, deleteTarget._id);
      await load();
      showToast("User story deleted");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete user story", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const genAll = async () => {
    if (!orgId || !projectId || !requirementId) return;
    setGeneratingAll(true);
    for (const story of stories) {
      if (generatedByStory[story._id]) continue;
      setGeneratingCodeFor(story._id);
      try {
        const result = await generateCode(orgId, projectId, requirementId, story._id);
        setGeneratedByStory((p) => ({ ...p, [story._id]: result }));
      } catch (err: any) {
        showToast(
          `Failed to generate code for "${story.title}": ${err.response?.data?.message || "Unknown error"}`,
          "error"
        );
      }
    }
    setGeneratingCodeFor(null);
    setGeneratingAll(false);
    showToast("Finished generating code for all stories");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950">
        <AppNavbar />
        <PageContainer>
          <Loading label="Loading user stories..." />
        </PageContainer>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNavbar />
      <PageContainer>
        <BackButton to={`/organizations/${orgId}/projects/${projectId}`} label="Back to Requirements" />
        <PageHeader
          eyebrow="AI development"
          title="User Stories"
          description="Review the generated stories and turn each story into real code with the AI workflow."
          actions={
            stories.length > 0 ? (
              <button
                onClick={genAll}
                disabled={generatingAll}
                className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-50"
              >
                {generatingAll ? "Generating all..." : "✦ Generate Code for All"}
              </button>
            ) : undefined
          }
        />
        <ErrorMessage message={error} />
        {stories.length === 0 ? (
          <EmptyState
            icon="✦"
            title="No user stories yet"
            description="Go back to the requirement list and generate stories with AI first."
          />
        ) : (
          <div className="space-y-5">
            {stories.map((story) => {
              const generated = generatedByStory[story._id];
              return (
                <article key={story._id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                  {editingId === story._id ? (
                    <div className="space-y-3">
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="min-h-28"
                      />
                      <Input
                        value={editCriteria}
                        onChange={(e) => setEditCriteria(e.target.value)}
                        placeholder="Acceptance criteria, comma-separated"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => save(story._id)}
                          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                            User story
                          </span>
                          <h2 className="mt-1 text-xl font-bold text-white">{story.title}</h2>
                          <p className="mt-3 text-sm leading-6 text-slate-400">{story.description}</p>
                        </div>
                        <button
                          onClick={() => gen(story._id)}
                          disabled={generatingCodeFor === story._id || generatingAll}
                          className="shrink-0 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50"
                        >
                          {generatingCodeFor === story._id ? "Generating..." : "✦ Generate Code with AI"}
                        </button>
                      </div>
                      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Acceptance criteria
                        </p>
                        <ul className="space-y-2 text-sm text-slate-400">
                          {story.acceptanceCriteria.map((c, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-emerald-400">✓</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          onClick={() => edit(story)}
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(story)}
                          className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                      {generated && (
                        <GeneratedCodePanel
                          generated={generated}
                          pushing={pushingFor === story._id}
                          onPush={() => push(story._id)}
                        />
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </PageContainer>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete user story"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={removeConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}