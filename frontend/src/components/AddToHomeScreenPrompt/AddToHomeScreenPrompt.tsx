"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Styles from "./AddToHomeScreenPrompt.module.css";

const LOCALSTORAGE_KEY = "hideAddToHomeScreenPrompt";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export const AddToHomeScreenPrompt: React.FC = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(LOCALSTORAGE_KEY) === "1") return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (isIosDevice) setShow(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleAdd = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleClose = () => setShow(false);
  const handleNever = () => {
    localStorage.setItem(LOCALSTORAGE_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className={Styles.promptBar}>
      <Image src="/icons/icon-192.png" alt="App icon" width={40} height={40} />
      <div className={Styles.textBlock}>
        <div className={Styles.title}>Add FoodSnap AI to your Home Screen!</div>
        {isIos ? (
          <div className={Styles.instruction}>
            Open the <b>Share</b> menu and tap <b>&ldquo;Add to Home Screen&rdquo;</b>.
          </div>
        ) : (
          <div className={Styles.instruction}>
            Install the app for faster access.
          </div>
        )}
      </div>
      {!isIos && deferredPrompt && (
        <button className={Styles.addBtn} onClick={handleAdd}>Add</button>
      )}
      <button className={Styles.closeBtn} onClick={handleClose}>Close</button>
      <button className={Styles.neverBtn} onClick={handleNever}>&apos;Don&apos;t show again&apos;</button>
    </div>
  );
};
