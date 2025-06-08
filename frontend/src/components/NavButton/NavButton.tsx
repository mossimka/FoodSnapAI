import React from "react";
import Link from "next/link";

import Styles from "./NavButton.module.css";

interface NavButtonProps {
  text: string;
  link: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ text, link }) => {
  return (
    <Link href={link}>
      <button className={Styles.navButton}>{text}</button>
    </Link>
  );
};
