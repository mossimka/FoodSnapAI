import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, Easing } from "framer-motion";

import Styles from "./PasswordInput.module.css";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as Easing
    }
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.1
    }
  }
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  value,
  onChange,
  className = "",
  placeholder = "Password"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        required
      />
      <motion.button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className={Styles.icon}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </motion.button>
    </div>
  );
};
