"use client";

import React, { useEffect, useState} from "react";
import Image from "next/image";
import { UtensilsCrossed, Cookie, CookingPot, ChefHat, Hamburger, Croissant, Pizza, Salad, Dessert } from 'lucide-react';

import Styles from "./HeroSection.module.css";

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
  up: boolean
) => (
  <div className={rotationClass}>
    <div className={up ? Styles.imageTrackUp : Styles.imageTrackDown}>
      {[...images, ...images].map((src, idx) => (
        <Image
          className={Styles.imageTrackImg}
          src={src}
          alt={`food-${idx}`}
          key={idx}
          width={200}
          height={200}
        />
      ))}
    </div>
  </div>
);


export const HeroSection: React.FC = () => {
  const [positions, setPositions] = useState<{ top: string; left: string }[]>([]);

  useEffect(() => {
    const newPositions = ICONS.map(() => ({
      top: `${50 + getRandomOffset(90)}%`,
      left: `${50 + getRandomOffset(90)}%`,
    }));
    setPositions(newPositions);
  }, []);

  return (
    <div className={Styles.heroSection}>
      <div className={`${Styles.scrollColumn} ${Styles.left}`}>
        {renderTrack(Styles.tiltLeft, foodImages1, false)}
        {renderTrack(Styles.tiltLeft, foodImages2, true)}
      </div>

      <div className={Styles.centerContent}>
        <button className={Styles.ctaButton}>Cooking revolution <UtensilsCrossed /></button>
        <p>
          Upload dish and get a{" "}
          <span className="gradientText">recipe immediately</span>
        </p>
      </div>

      <div className={`${Styles.scrollColumn} ${Styles.right}`}>
        {renderTrack(Styles.tiltRight, foodImages1, true)}
        {renderTrack(Styles.tiltRight, foodImages2, false)}
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
