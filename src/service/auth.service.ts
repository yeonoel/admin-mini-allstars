import API_URL from "../config";
import type { User } from "../types";
import { apiFetch } from "./api/api";

interface LoginResponse {
    success: boolean;
    token: string;
    data: User
}

export const loginApi = async (phone: string, password: string): Promise<LoginResponse> => {
    console.log(phone, password);
    const data = await apiFetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
    });
    return data;
}