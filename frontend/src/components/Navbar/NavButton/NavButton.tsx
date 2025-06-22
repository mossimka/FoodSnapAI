import React from "react";
import Link from "next/link";

interface NavButtonProps {
  text: string;
  link: string;
  inputStyle?: React.CSSProperties;
}

export const NavButton: React.FC<NavButtonProps> = ({ text, link, inputStyle }) => {
  return (
    <Link href={link}>
      <button className="button" style={inputStyle}>{text}</button>
    </Link>
  );
};
