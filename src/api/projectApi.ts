import axiosClient from "./axiosClient";
import type { Project } from "../types/organization";

export const getProjects = async (orgId: string): Promise<Project[]> => {
  const response = await axiosClient.get<Project[]>(`/organizations/${orgId}/projects`);
  return response.data;
};

export const createProject = async (orgId: string, name: string): Promise<Project> => {
  const response = await axiosClient.post<Project>(`/organizations/${orgId}/projects`, { name });
  return response.data;
};

export const createGithubRepo = async (orgId: string, projectId: string): Promise<Project> => {
  const response = await axiosClient.post<Project>(
    `/organizations/${orgId}/projects/${projectId}/github/create-repo`
  );
  return response.data;
};

export const updateProject = async (
  orgId: string,
  projectId: string,
  name: string,
  description: string
): Promise<Project> => {
  const response = await axiosClient.put<Project>(
    `/organizations/${orgId}/projects/${projectId}`,
    { name, description }
  );
  return response.data;
};

export const deleteProject = async (orgId: string, projectId: string): Promise<void> => {
  await axiosClient.delete(`/organizations/${orgId}/projects/${projectId}`);
};