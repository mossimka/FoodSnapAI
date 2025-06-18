import React from "react";
//import Image from "next/image";

import Styles from "./page.module.css";
import { HeroSection } from "@/components/HeroSection/HeroSection";
import { Generation } from "@/components/Generation/Generation";

export default function Home() {

  return (
    <>
      <main className={Styles.main}>
        <HeroSection />
        <Generation />
      </main>
    </>
  );
}
