import React from "react";
//import Image from "next/image";

import Styles from "./page.module.css";
import { Navbar } from "@/components/Navbar/Navbar"
import { HeroSection } from "@/components/HeroSection/HeroSection";
import { DropZoneWrapper } from "@/components/DropZoneWrapper/DropZoneWrapper";
import { Footer } from '@/components/Footer/Footer';

export default function Home() {

  return (
    <>
      <Navbar />
      <main className={Styles.main}>
        <HeroSection />
        <DropZoneWrapper />
      </main>
      <Footer />
    </>
  );
}
