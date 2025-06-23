import React, { useEffect } from "react";
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
  return (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.popup} onClick={(e) => e.stopPropagation()}>
        <p className={Styles.message}>Sign in to continue</p>
        <NavButton text="Sign in" link="/signin"/>
        <button className={Styles.close} onClick={onClose}><X /></button>
      </div>
    </div>
  );
};