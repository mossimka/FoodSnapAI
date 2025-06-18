"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

import Styles from "./Navbar.module.css";
import { NavButton } from "./NavButton/NavButton";
import { ProfilePopup } from "./ProfilePopup/ProfilePopup";
import { useUserStore } from "@/stores/userStore";

export const Navbar: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <header className={Styles.header}>
      <Link href="/" className={Styles.logoLink}>      
        <section className={Styles.logoSection}>
          <Image
            src="/images/logo.png"
            alt="logo"
            className={Styles.logo}
            width={60}
            height={60}
          />
          <h1>FoodSnap <span className="gradientText">AI</span></h1>
        </section>
      </Link>
      <nav className={Styles.nav}>
        <NavButton text="+ Generate a recipe" link="/generate" />
        <NavButton text="View recipies" link="/posted" />

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
      </nav>
    </header>
  );
};
