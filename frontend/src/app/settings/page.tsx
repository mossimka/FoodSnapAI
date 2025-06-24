"use client";

import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Styles from "./settings.module.css";
import ProfilePicUploader from "@/components/Profile/ProfilePicUploader/ProfilePicUploader";
import { PasswordInput } from '@/components/Auth/PasswordInput/PasswordInput';
import { patchUser } from '@/services/profileService';
import { useUserStore } from '@/stores/userStore';

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patchUser(user.id, { username });
      user.username = username;
      toast.success('Username updated!');
    } catch (err) {
      toast.error('Failed to update username');
      console.log(err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patchUser(user.id, { password });
      toast.success('Password updated!');
    } catch (err) {
      toast.error('Failed to update password');
      console.log(err);
    }
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.columns}>
        <section className={Styles.left}>
          <h2 className={Styles.sectionTitle}>Account <span className={Styles.username}>{user.username}</span></h2>
          <div className={Styles.avatarBlock}>
            <ProfilePicUploader />
          </div>
          <button
            className="buttonRed"
            onClick={() => window.confirm("Are you sure you want to delete your account?") && alert("Account deleted (stub)")}
          >
            Delete account
          </button>
        </section>

        <section className={Styles.right}>
          <form className={Styles.form} onSubmit={handleUsernameSubmit}>
            <label className={Styles.label}> 
              Username
              <input
                className={Styles.input}
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={handleUsernameChange}
              />
            </label>
            <button className="buttonGreen" type="submit">Save</button>
          </form>
          <form className={Styles.form} onSubmit={handlePasswordSubmit}>
            <label className={Styles.label}>
              New password
              <PasswordInput name="password" value={password} onChange={handlePasswordChange} className={Styles.input}/>
            </label>
            <button className="button" type="submit">Change password</button>
          </form>
        </section>
      </div>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Feedback</h2>
        <a
          href="mailto:maksimsarsekeyev@gmail.com"
          className="button"
          style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}
        >
          Contact Support
        </a>
      </section>
    </div>
  );
}