"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowBigRightDash } from "lucide-react";

import Styles from "./ProfilePopup.module.css";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/services/authService";

interface ProfilePopupProps {
  onClose: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({ onClose }) => {
  const { isAuthenticated } = useAuthStore();

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
              <Link href="/profile" className={Styles.link}>
                <span className="gradientText">View Profile</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <Link href="/settings" className={Styles.link}>
                <span className="gradientText">Settings</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <button className={Styles.link} onClick={handleLogout}>
                <Link className={Styles.link} href="/signin">
                  <span className="gradientText">Logout</span>
                  <ArrowBigRightDash className={Styles.arrow} />
                </Link>
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/signin" className={Styles.link}>
                <span className="gradientText">Sign in</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <Link href="/signup" className={Styles.link}>
                <span className="gradientText">Sign Up</span>
                <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
          </>
        )}
      </ul>
    </motion.div>
  );
};
