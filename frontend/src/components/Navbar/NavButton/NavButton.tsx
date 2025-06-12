import React from "react";
import Link from "next/link";

interface NavButtonProps {
  text: string;
  link: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ text, link }) => {
  return (
    <Link href={link}>
      <button className="button">{text}</button>
    </Link>
  );
};
