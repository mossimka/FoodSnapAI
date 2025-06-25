import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowBigRightDash } from "lucide-react";
import { FaTimes } from "react-icons/fa";

import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/services/authService";
import { ThemeToggleButton } from "@/components/Style/ThemeToggle/ThemeToggle";

import Styles from "./BurgerMenu.module.css";

interface BurgerMenuProps {
  onClose: () => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ onClose }) => {
  const user = useUserStore((state) => state.user);
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [isClosing, setIsClosing] = useState(false);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  return (
    <nav className={`${Styles.mobileNav} ${isClosing ? Styles.slideOut : ''}`}>
      <button className={Styles.closeBtn} onClick={handleClose} aria-label="Close menu">
        <FaTimes size={36} />
      </button>

      {isAuthenticated && (
        <div className={Styles.profileBlock}>
          <Image
            src={user?.profile_pic || "/images/user.png"}
            alt="user"
            className={Styles.user}
            width={60}
            height={60}
          />
          <div className={Styles.themeToggleWrapper}>
            <ThemeToggleButton />
          </div>
        </div>
      )}

      <ul className={Styles.menuList}>
        {isAuthenticated ? (
          <>
            <li>
              <Link
                href="/generate"
                className={`${Styles.link} ${pathname === "/generate" ? Styles.active : ""}`}
                onClick={onClose}
              >
                + Generate a recipe <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <Link
                href="/posted"
                className={`${Styles.link} ${pathname === "/posted" ? Styles.active : ""}`}
                onClick={onClose}
              >
                View recipes <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`${Styles.link} ${pathname === "/profile" ? Styles.active : ""}`}
                onClick={onClose}
              >
                View Profile <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className={`${Styles.link} ${pathname === "/settings" ? Styles.active : ""}`}
                onClick={onClose}
              >
                Settings <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <Link href="/signin" className={Styles.link} onClick={handleLogout}>
                Logout <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href="/signin"
                className={`${Styles.link} ${pathname === "/signin" ? Styles.active : ""}`}
                onClick={onClose}
              >
                Sign In <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className={`${Styles.link} ${pathname === "/signup" ? Styles.active : ""}`}
                onClick={onClose}
              >
                Sign Up <ArrowBigRightDash className={Styles.arrow} />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
