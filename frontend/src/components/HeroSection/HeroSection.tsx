"use client";

import React from "react";
import Image from "next/image";
import { UtensilsCrossed, Cookie, CookingPot, ChefHat, Hamburger, Croissant, Pizza, Salad, Dessert } from 'lucide-react';

import Styles from "./HeroSection.module.css";
import { NavButton } from "../Navbar/NavButton/NavButton";
import { Printer } from "@/components/Style/Printer/Printer";


const ICONS = [ChefHat, Cookie, CookingPot, Hamburger, Croissant, Pizza, Salad, Dessert];

const foodImages1 = [
    "/images/food1.png", 
    "/images/food3.png",
    "/images/food5.png",
    "/images/food7.png",
    "/images/food9.png",
  ];
  const foodImages2 = [
    "/images/food2.png",
    "/images/food4.png",
    "/images/food6.png",
    "/images/food8.png",
    "/images/food10.png",
  ];


  const renderTrack = (
    rotationClass: string,
    images: string[],
    up: boolean,
    mobileOnly?: boolean
  ) => (
    <div className={`${rotationClass} ${mobileOnly ? Styles.mobileOnly : ""}`}>
      <div className={up ? Styles.imageTrackUp : Styles.imageTrackDown}>
        {[...images, ...images].map((src, idx) => (
          <div key={idx} className={Styles.imageWrapper}>
            <Image
              className={Styles.imageTrackImg}
              src={src}
              alt={`food-${idx}`}
              fill
              sizes="(max-width: 768px) 100px, (max-width: 1024px) 140px, 180px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>

  );


  export const HeroSection: React.FC = () => {

    return (
      <div className={Styles.heroSection}>
        <div className={`${Styles.scrollColumn} ${Styles.left}`}>
          {renderTrack(Styles.tiltLeft, foodImages1, false)}
          {renderTrack(Styles.tiltLeft, foodImages2, true)}
        </div>

        <div className={`${Styles.scrollColumn} ${Styles.right}`}>
          {renderTrack(Styles.tiltRight, foodImages1, true)}
          {renderTrack(Styles.tiltRight, foodImages2, false)}
        </div>  

        <div className={Styles.centerContent}>
          <div className={Styles.ctaButton}>
            <Printer initialText="Cooking revolution" fontSize="2rem" textAlign="center" className="gradientText"/>
            <UtensilsCrossed style={{color: "var(--color2)"}}/>
          </div>

          <p style={{ marginBottom: 10}}>
            Upload dish and get a{" "}
            <span className="gradientText">recipe immediately</span>
          </p>
          <NavButton text="Try it out!" link="/generate"/>
        </div>


        <div className={Styles.iconContainer}>
          {ICONS.map((Icon, idx) => {
            const angle = (360 / ICONS.length) * idx;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <Icon className={Styles.icon} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };