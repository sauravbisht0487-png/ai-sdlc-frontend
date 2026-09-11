import axiosClient from "./axiosClient";
import type { Requirement } from "../types/organization";

export const getRequirements = async (orgId: string, projectId: string): Promise<Requirement[]> => {
  const response = await axiosClient.get<Requirement[]>(
    `/organizations/${orgId}/projects/${projectId}/requirements`
  );
  return response.data;
};

export const createRequirement = async (
  orgId: string,
  projectId: string,
  title: string,
  description: string
): Promise<Requirement> => {
  const response = await axiosClient.post<Requirement>(
    `/organizations/${orgId}/projects/${projectId}/requirements`,
    { title, description }
  );
  return response.data;
};

export const generateStories = async (
  orgId: string,
  projectId: string,
  requirementId: string
): Promise<{ message: string }> => {
  const response = await axiosClient.post(
    `/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}/generate-stories`
  );
  return response.data;
};

export const updateRequirement = async (
  orgId: string,
  projectId: string,
  requirementId: string,
  title: string,
  description: string,
  status: string
): Promise<Requirement> => {
  const response = await axiosClient.put<Requirement>(
    `/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}`,
    { title, description, status }
  );
  return response.data;
};

export const deleteRequirement = async (
  orgId: string,
  projectId: string,
  requirementId: string
): Promise<void> => {
  await axiosClient.delete(`/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}`);
};