import React from "react";
import Image from "next/image";
import { UtensilsCrossed, Cookie, CookingPot, ChefHat, Hamburger, Croissant, Pizza, Salad, Dessert } from 'lucide-react';

import Styles from "./HeroSection.module.css";
import { NavButton } from "../Navbar/NavButton/NavButton";
import { Printer } from "@/components/Style/Printer/Printer";
import Highlight from "@/components/Highlights/Highlight";


const ICONS = [ChefHat, Cookie, CookingPot, Hamburger, Croissant, Pizza, Salad, Dessert];

const foodImages1 = [
    "/images/food1.webp", 
    "/images/food3.webp",
    "/images/food5.webp",
    "/images/food7.webp",
    "/images/food9.webp",
  ];
  const foodImages2 = [
    "/images/food2.webp",
    "/images/food4.webp",
    "/images/food6.webp",
    "/images/food8.webp",
    "/images/food10.webp",
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
              <Printer 
                initialText="Cooking revolution" 
                fontSize="3rem" 
                textAlign="center" 
                className="gradientText" 
                fontFamily="'Brittany', cursive" 
                textShadow="neonPulse"
                brightness="lighter"
              />
            <UtensilsCrossed style={{color: "var(--color2)", filter: "drop-shadow(0 2px 4px rgba(244, 138, 59, 0.3))"}}/>
          </div>

          <strong style={{ marginBottom: 10, fontWeight: "400"}}>
            Upload dish and get a{" "}
            <span className="gradientText">recipe immediately</span>
          </strong>
          <NavButton text="Try it out!" link="/generate"/>

          {/* Desktop Highlight */}
          <div className={Styles.highlightDesktop}>
            <Highlight
              text={
                <>
                  From the photo of the dish — find<br /> 
                  out the recipe, calories.
                </>
              }
              left={320}
              top={-100}
              angle={20}
              fontWeight={500}
              fontSize="1rem"
            />
          </div>

          {/* Tablet Highlight */}
          <div className={Styles.highlightTablet}>
            <Highlight
              text="From photo — get recipe & calories!"
              left={200}
              top={-80}
              angle={15}
              fontWeight={500}
              fontSize="0.9rem"
            />
          </div>

          {/* Mobile Highlight */}
          <div className={Styles.highlightMobile}>
            <Highlight
              text="From photo — get recipe & calories!"
              left={150}
              top={-60}
              angle={10}
              fontWeight={500}
              fontSize="0.8rem"
            />
          </div>
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