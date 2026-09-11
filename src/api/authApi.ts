import apiClient from "./axiosClient";
import type { AuthResponse, User } from "../types/organization";

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupInput extends Credentials {
  name: string;
}

export const login = async (credentials: Credentials) =>
  (await apiClient.post<AuthResponse>("/auth/login", credentials)).data;

export const signup = async (input: SignupInput) =>
  (await apiClient.post<AuthResponse>("/auth/signup", input)).data;

export const getCurrentUser = async () =>
  (await apiClient.get<User>("/auth/me")).data;
