import React from "react";
import { motion } from "framer-motion";
import { ArrowBigRightDash } from "lucide-react";

import Styles from "./ProfilePopup.module.css";


interface ProfilePopupProps {
  onClose: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({ onClose }) => {
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
        <li>
            <a href="/profile" className={Styles.link}>
                <span className="gradientText">View Profile </span><ArrowBigRightDash className={Styles.arrow}/>
            </a>
        </li>
        <li>
            <a href="/settings" className={Styles.link}>
                <span className="gradientText">Settings</span> <ArrowBigRightDash className={Styles.arrow}/>
            </a>
        </li>
        <li>
            <a href="/logout" className={Styles.link}>
                <span className="gradientText">Logout</span><ArrowBigRightDash className={Styles.arrow}/>
            </a>
        </li>
      </ul>
    </motion.div>
  );
};
