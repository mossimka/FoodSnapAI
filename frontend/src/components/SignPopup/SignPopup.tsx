import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import Styles from "./SignPopup.module.css";
import { NavButton } from "../Navbar/NavButton/NavButton";

interface SignPopupProps {
  onClose: () => void;
}

export const SignPopup: React.FC<SignPopupProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const popup = (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.popup} onClick={(e) => e.stopPropagation()}>
        <p className={Styles.message}>Sign in to continue</p>
        <NavButton text="Sign in" link="/signin"/>
        <p>or</p>
        <NavButton text="Sign up" link="/signup"/>
        <button className={Styles.close} onClick={onClose}><X /></button>
      </div>
    </div>
  );

  // Используем портал
  return typeof window !== "undefined"
    ? createPortal(popup, document.body)
    : null;
};