import axios from '@/lib/axios';
import { AxiosError } from 'axios';

export async function getAllUsers() {
    try {
        const response = await axios.get('/admin/users');
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to fetch users');
    }
}

export async function getUserById(id: string) {
    try {
        const response = await axios.get(`/admin/users/${id}`);
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to fetch user');
    }
}

export async function toggleAdminRights(id: string, isAdmin: boolean) {
    try {
        const response = await axios.patch(`/admin/users/${id}/admin`, { isAdmin });
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to toggle admin rights');
    }
}

export async function deleteUser(id: string) {
    try {
        const response = await axios.delete(`/admin/users/${id}`);
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to delete user');
    }
}

export async function getAllRecipes() {
    try {
        const response = await axios.get('/admin/recipes');
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to fetch recipes');
    }
} 

export async function deleteRecipe(id: string) {
    try {
        const response = await axios.delete(`/admin/recipes/${id}`);
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to delete recipe');
    }
}

export async function getUserStats() {
    try {
        const response = await axios.get('/admin/stats/users');
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to fetch user stats');
    }
}

export async function getRecipeStats() {
    try {
        const response = await axios.get('/admin/stats/recipes');
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to fetch recipe stats');
    }
}

export async function getAdminDashboard() {
    try {
        const response = await axios.get('/admin/dashboard');
        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ detail: string }>;
        throw new Error(err.response?.data?.detail || 'Failed to fetch admin dashboard');
    }
}