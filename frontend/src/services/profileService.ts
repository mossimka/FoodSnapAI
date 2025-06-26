import { AxiosError } from "axios";
import axios from '@/lib/axios';

import { UserPatchRequest } from '@/interfaces/user';
import { useUserStore } from "@/stores/userStore";

export async function uploadProfilePic(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("access_token");

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

export async function patchUser(userId: number, data: UserPatchRequest) {
  const response = await axios.patch(`/auth/patch/${userId}`, data);
  if (data.username != null) {
    const setUser = useUserStore.getState().setUser;
    const user = useUserStore.getState().user;
    if (user && user.id !== undefined) {
      setUser({
        ...user,
        username: data.username,
        id: user.id,
      });
    }
  }
  return response.data;
}
