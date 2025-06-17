import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Styles from "./PasswordInput.module.css";
interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  value,
  onChange,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Password"
        className={className}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className={Styles.icon}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
};
