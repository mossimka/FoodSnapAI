"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowBigRightDash } from "lucide-react";

import Styles from "./ProfilePopup.module.css";
import { useAuthStore } from "@/stores/authStore";

interface ProfilePopupProps {
  onClose: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({ onClose }) => {
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <motion.div
      className={Styles.popup}
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <a href="/profile" className={Styles.link}>
                <span className="gradientText">View Profile</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </a>
            </li>
            <li>
              <a href="/settings" className={Styles.link}>
                <span className="gradientText">Settings</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </a>
            </li>
            <li>
              <button className={Styles.link} onClick={handleLogout}>
                <span className="gradientText">Logout</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="/signin" className={Styles.link}>
                <span className="gradientText">Sign in</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </a>
            </li>
            <li>
              <a href="/signup" className={Styles.link}>
                <span className="gradientText">Sign Up</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </a>
            </li>
          </>
        )}
      </ul>
    </motion.div>
  );
};
