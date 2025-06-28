import { AxiosError } from "axios";
import axios from '@/lib/axios';
import { tokenService } from './tokenService';

import { UserPatchRequest } from '@/interfaces/user';
import { useUserStore } from "@/stores/userStore";

export async function uploadProfilePic(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = tokenService.requireAuth();

  try {
    const response = await axios.post("/user/upload-profile-pic", formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.profile_pic;
  } catch (error) {
    const err = error as AxiosError;
    const message =
      err.response?.data && typeof err.response.data === "string"
        ? err.response.data
        : err.message || "Unknown upload error";

    console.error("Upload failed:", message);
    throw new Error("Failed to upload profile picture: " + message);
  }
}

export async function updateProfile(data: UserPatchRequest): Promise<void> {
  try {
    const response = await axios.patch("/user/", data, {
      headers: {
        ...tokenService.getAuthHeader(),
      },
    });

    useUserStore.getState().setUser(response.data);
  } catch (error) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || "Failed to update profile");
  }
}
