"use client";

import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import { ReviewCard } from './ReviewCard/ReviewCard';
import Styles from './ReviewSection.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeProvider';

const ReviewSection = () => {
  const { theme } = useTheme();

  const reviewCards = [
    {
      reviewText: "Amazing food recognition! The app instantly identified my dish and provided detailed nutritional information.",
      authorName: "Apas Dauren",
      authorImage: "/images/user1.webp",
      rating: 5
    },
    {
      reviewText: "Love how easy it is to track my meals. Just snap a photo and get all the details!",
      authorName: "Akhmetaliyev Muslim", 
      authorImage: "/images/user2.webp",
      rating: 5
    },
    {
      reviewText: "Perfect for my diet tracking. Very accurate results and clean interface.",
      authorName: "Munsyzbayev Daniyar",
      authorImage: "/images/user3.webp", 
      rating: 4
    },
    {
      reviewText: "Great app for health-conscious people. Helps me make better food choices.",
      authorName: "Emily Davis",
      authorImage: "/images/user4.webp",
      rating: 5
    }
  ];

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,
    defaultAnimation: {
      duration: 1500,
      easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    slides: {
      perView: 3,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 1,
          spacing: 16,
        },
      },
      "(max-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
    },
  }, [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>
      let mouseOver = false
      
      function clearNextTimeout() {
        clearTimeout(timeout)
      }
      
      function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider.next()
        }, 2000)
      }
      
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })
      
      slider.on("dragStarted", clearNextTimeout)
      slider.on("animationEnded", nextTimeout)
      slider.on("updated", nextTimeout)
    },
  ]);

  const peerlistBadgeUrl = theme === 'dark' 
    ? 'https://peerlist.io/images/Launch_Badge_Dark.svg'
    : 'https://peerlist.io/images/Launch_Badge_Light.svg';

  return (
    <div className={Styles.reviewSection}>
      <div className={Styles.header}>
        <h2 className={Styles.title}>Reviews</h2>
        <div className={Styles.links}>
          <Link href="https://www.producthunt.com/products/foodsnapai" className={Styles.linkItem} target="_blank">
            <Image src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=996659&theme=light&t=1753373907725" alt="Product Hunt" width={200} height={48} className={Styles.linkImage}/>
          </Link>
          <Link href="https://peerlist.io/products/foodsnapai" className={Styles.linkItem} target="_blank">
            <Image src={peerlistBadgeUrl} alt="Peerlist" width={200} height={48} className={Styles.linkImage}/>
          </Link>
        </div>
      </div>
      <div ref={sliderRef} className={`keen-slider ${Styles.slider}`}>
        {reviewCards.map((card, index) => (
          <div className="keen-slider__slide" key={`review-${index}`}>
            <ReviewCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
