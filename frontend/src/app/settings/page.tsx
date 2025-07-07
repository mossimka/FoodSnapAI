"use client";

import React, { useState } from 'react';
import { motion, Easing } from 'framer-motion';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Lock,
  Mail,
  Trash2,
  Settings as SettingsIcon,
  Save,
  Shield,
  Bell
} from 'lucide-react';

import Styles from "./settings.module.css";
import ProfilePicUploader from "@/components/Profile/ProfilePicUploader/ProfilePicUploader";
import { PasswordInput } from '@/components/Auth/PasswordInput/PasswordInput';
import { updateProfile } from '@/services/userService';
import { useUserQuery } from '@/hooks/useUserQuery';
import { ConfirmationModal } from "@/components/ConfirmationModal/ConfirmationModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as Easing
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as Easing
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as Easing
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as Easing
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

export default function SettingsPage() {
  const { data: user} = useUserQuery();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) {
    return (
      <motion.div
        className={Styles.loadingWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={Styles.loadingSpinner}
        />
        <p>Loading your settings...</p>
      </motion.div>
    );
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value.length > 30) {
      toast.error("Username must be less than 30 characters long");
      return;
    }
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await updateProfile({ username });
      toast.success('Username updated successfully!');
      setUsername('');
    } catch (err) {
      toast.error('Failed to update username');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    try {
      await updateProfile({ password });
      toast.success('Password updated successfully! 🔒');
      setPassword('');
    } catch (err) {
      toast.error('Failed to update password 😔');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    toast.info("Account deletion feature coming soon!");
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <motion.div
      className={Styles.wrapper}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div className={Styles.header} variants={itemVariants}>
        <motion.div className={Styles.headerContent} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <SettingsIcon className={Styles.headerIcon} />
          <div>
            <h1 className={Styles.mainTitle}>
              <span className="gradientText">Settings</span>
            </h1>
            <p className={Styles.subtitle}>Manage your account preferences</p>
          </div>
        </motion.div>
      </motion.div>

      <div className={Styles.columns}>
        {/* Left Column - Profile Section */}
        <motion.section className={Styles.left} variants={cardVariants} whileHover="hover">
          <motion.div className={Styles.profileHeader} variants={itemVariants}>
            <User className={Styles.sectionIcon} />
            <h2 className={Styles.sectionTitle}>
              <span className="gradientText">Profile</span>
            </h2>
            <p className={Styles.username}>@{user.username}</p>
          </motion.div>

          <motion.div className={Styles.avatarBlock} variants={itemVariants} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <ProfilePicUploader />
          </motion.div>

          <motion.button
            className="buttonRed"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleDeleteAccount}
          >
            <Trash2 size={18} />
            Delete Account
          </motion.button>
        </motion.section>

        {/* Right Column - Settings Forms */}
        <motion.section className={Styles.right} variants={cardVariants} whileHover="hover">
          {/* Username Form */}
          <motion.form className={Styles.form} onSubmit={handleUsernameSubmit} variants={itemVariants}>
            <motion.div className={Styles.formHeader} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <User className={Styles.formIcon} />
              <label className={Styles.label}>Username</label>
            </motion.div>
            <input
              className={Styles.input}
              type="text"
              placeholder="Enter new username"
              value={username}
              onChange={handleUsernameChange}
            />
            <motion.button
              className="buttonGreen"
              type="submit"
              disabled={isLoading || !username.trim()}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save Username'}
            </motion.button>
          </motion.form>

          {/* Password Form */}
          <motion.form className={Styles.form} onSubmit={handlePasswordSubmit} variants={itemVariants}>
            <motion.div className={Styles.formHeader} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Lock className={Styles.formIcon} />
              <label className={Styles.label}>New Password</label>
            </motion.div>
            <PasswordInput
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className={Styles.input}
              placeholder="Enter new password"
            />
            <motion.button
              className="button"
              type="submit"
              disabled={isLoading || !password.trim()}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Shield size={18} />
              {isLoading ? 'Updating...' : 'Change Password'}
            </motion.button>
          </motion.form>
        </motion.section>
      </div>

      {/* Feedback Section */}
      <motion.section className={Styles.section} variants={cardVariants} whileHover="hover">
        <motion.div className={Styles.feedbackHeader} variants={itemVariants}>
          <Mail className={Styles.sectionIcon} />
          <h2 className={Styles.sectionTitle}>Feedback & Support</h2>
        </motion.div>

        <motion.div className={Styles.feedbackContent} variants={itemVariants}>
          <p className={Styles.feedbackText}>
            Have questions or suggestions? We would love to hear from you!
          </p>
          <motion.a
            href="mailto:maksimsarsekeyev@gmail.com"
            className="button"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Bell size={18} />
            Contact Support
          </motion.a>
        </motion.div>
      </motion.section>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your recipes and data."
        confirmText="Delete Account"
        cancelText="Cancel"
        isLoading={false}
      />
    </motion.div>
  );
}
