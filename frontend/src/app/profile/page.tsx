'use client';

import React from "react";
import Styles from "./profile.module.css";
import { useUserStore } from "@/stores/userStore";
import ProfilePicUploader from "@/components/DropZoneWrapper/ProfilePicUploader/ProfilePicUploader";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return (
      <div className={Styles.wrapper}>
        <p>You are not logged in</p>
      </div>
    );
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.profileCard}>
        <div className={Styles.pictureWrapper}>
          <ProfilePicUploader />
        </div>
        <div className={Styles.profileInfo}>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className={Styles.recipesSection}>
        <h3>Loaded recipes</h3>
        <p>There is nothing here...</p>
      </div>
    </div>
  );
}
