"use client";

import React from 'react';

import Styles from "./settings.module.css";
import ProfilePicUploader from "@/components/Profile/ProfilePicUploader/ProfilePicUploader";

export default function SettingsPage() {
  return (
    <div className={Styles.wrapper}>
      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Account</h2>
        <div>
          <ProfilePicUploader />
        </div>
        <form className={Styles.form}>
          <label className={Styles.label}> 
            Username
            <input className={Styles.input} type="text" placeholder="Enter new username" />
          </label>
          <button className="buttonGreen" type="submit">Save</button>
        </form>
        <form className={Styles.form}>
          <label className={Styles.label}>
            New password
            <input className={Styles.input} type="password" placeholder="Enter new password" />
          </label>
          <button className="button" type="submit">Change password</button>
        </form>
        <button
          className="buttonRed"
          onClick={() => window.confirm("Are you sure you want to delete your account?") && alert("Account deleted (stub)")}
        >
          Delete account
        </button>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Appearance</h2>
        <button className="button">Toggle theme</button>
      </section>

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