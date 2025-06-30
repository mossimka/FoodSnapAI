import { AxiosError } from "axios";
import axios from '@/lib/axios';
import { tokenService } from './tokenService';
import { useUserStore } from '@/stores/userStore';

import { UserPatchRequest } from '@/interfaces/user';

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

export async function updateProfile(data: UserPatchRequest) {
  const userId = useUserStore.getState().user?.id;
  
  if (!userId) {
    throw new Error("User not found. Please log in again.");
  }

  const token = tokenService.requireAuth();

  const response = await axios.patch(`/auth/patch/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
