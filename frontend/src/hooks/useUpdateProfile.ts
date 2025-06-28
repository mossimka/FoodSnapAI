import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/services/userService";
import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      useUserStore.getState().setUser(updatedUser);
      toast.success("Profile updated successfully");
    },
    onError: (error: unknown) => {
      const err = error as Error;
      toast.error(err.message || "Failed to update profile");
    },
  });
};
