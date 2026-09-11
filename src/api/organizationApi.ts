import axiosClient from "./axiosClient";
import type { Organization } from "../types/organization";

export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await axiosClient.get<Organization[]>("/organizations");
  return response.data;
};

export const createOrganization = async (name: string): Promise<Organization> => {
  const response = await axiosClient.post<Organization>("/organizations", { name });
  return response.data;
};

export const updateOrganization = async (orgId: string, name: string): Promise<Organization> => {
  const response = await axiosClient.put<Organization>(`/organizations/${orgId}`, { name });
  return response.data;
};

export const deleteOrganization = async (orgId: string): Promise<void> => {
  await axiosClient.delete(`/organizations/${orgId}`);
};