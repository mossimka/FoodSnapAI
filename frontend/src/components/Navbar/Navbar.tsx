"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

import Styles from "./Navbar.module.css";
import { NavButton } from "./NavButton/NavButton";
import { ProfilePopup } from "./ProfilePopup/ProfilePopup";
import { useUserQuery } from "@/hooks/useUserQuery";
import { BurgerMenu } from "./BurgerMenu/BurgerMenu";
import { ThemeToggleButton } from "@/components/Style/ThemeToggle/ThemeToggle";

export const Navbar: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user} = useUserQuery();

  return (
    <header className={Styles.header}>
      <button
        className={Styles.burger}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <Link href="/" className={Styles.logoLink}>      
        <section className={Styles.logoSection}>
          <Image
            src="/images/logo.png"
            alt="logo"
            className={Styles.logo}
            width={60}
            height={60}
          />
          <h1 className={Styles.logoText}>FoodSnap <span className="gradientText">AI</span></h1>
        </section>
      </Link>
      
      <nav className={Styles.nav}>
        <NavButton text="+ Generate Recipe" link="/generate" />
        <NavButton text="Browse Recipes" link="/posted" />

        <div className={Styles.profileWrapper}>
            <button
              onClick={() => setShowPopup(!showPopup)}
              className={Styles.profileButton}
            >
              <Image
                  src={user?.profile_pic|| "/images/user.png"}
                  alt="user"
                  className={Styles.user}
                  width={50}
                  height={50}
              />
            </button>
            <div className={Styles.popup}>
              <AnimatePresence>
                  {showPopup && <ProfilePopup onClose={() => setShowPopup(false)} />}
              </AnimatePresence>
            </div>
        </div>

        <div>
          <ThemeToggleButton></ThemeToggleButton>
        </div>
      </nav>
      
      {mobileMenuOpen && (
        <div className={Styles.mobileNavWrapper}>
          <BurgerMenu onClose={() => setMobileMenuOpen(false)}/>
        </div>
      )}
    </header>
  );
};