import axiosClient from "./axiosClient";
import type { UserStory, GeneratedCode } from "../types/organization";

export const getUserStories = async (
  orgId: string,
  projectId: string,
  requirementId: string
): Promise<UserStory[]> => {
  const response = await axiosClient.get<UserStory[]>(
    `/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}/userstories`
  );
  return response.data;
};

export const generateCode = async (
  orgId: string,
  projectId: string,
  requirementId: string,
  userStoryId: string
): Promise<GeneratedCode> => {
  const response = await axiosClient.post<GeneratedCode>(
    `/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}/userstories/${userStoryId}/generate-code`
  );
  return response.data;
};

export const pushToGithub = async (
  orgId: string,
  projectId: string,
  requirementId: string,
  generatedCodeId: string
): Promise<{ message: string }> => {
  const response = await axiosClient.post(
    `/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}/userstories/push-to-github`,
    { generatedCodeId }
  );
  return response.data;
};
export const updateUserStory = async (
  orgId: string,
  projectId: string,
  requirementId: string,
  userStoryId: string,
  title: string,
  description: string,
  acceptanceCriteria: string[]
): Promise<UserStory> => {
  const response = await axiosClient.put<UserStory>(
    `/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}/userstories/${userStoryId}`,
    { title, description, acceptanceCriteria }
  );
  return response.data;
};

export const deleteUserStory = async (
  orgId: string,
  projectId: string,
  requirementId: string,
  userStoryId: string
): Promise<void> => {
  await axiosClient.delete(
    `/organizations/${orgId}/projects/${projectId}/requirements/${requirementId}/userstories/${userStoryId}`
  );
};