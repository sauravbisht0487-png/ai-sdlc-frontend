export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Organization {
  _id: string;
  name: string;
  owner: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  organization: string | Organization;
  createdBy: string | User;
  githubRepoName?: string;
  githubRepoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type RequirementStatus = "draft" | "approved" | "in_progress" | "done";

export interface Requirement {
  _id: string;
  title: string;
  description: string;
  project: string | Project;
  createdBy: string | User;
  status: RequirementStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStory {
  _id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  requirement: string | Requirement;
  createdBy: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
export interface GeneratedCodeFile {
  filename: string;
  language: string;
  code: string;
}

export interface GeneratedCode {
  _id: string;
  userStory: string;
  files: GeneratedCodeFile[];
  createdBy: string | User;
  createdAt?: string;
  updatedAt?: string;
}