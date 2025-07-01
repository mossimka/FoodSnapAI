import React from "react";
import { Flame } from "lucide-react";

interface ShowCaloriesButtonProps {
  onClick: () => void;
  text?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const ShowCaloriesButton: React.FC<ShowCaloriesButtonProps> = ({
  onClick,
  text = "Nutrition info",
  style,
  className = "buttonGreen",
}) => (
  <button
    type="button"
    className={className}
    style={style}
    onClick={onClick}
  >
    <Flame size={18} style={{ marginRight: 6, verticalAlign: "middle" }} />
    {text}
  </button>
); 