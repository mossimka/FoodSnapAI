"use client";

import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import { ReviewCard } from './ReviewCard/ReviewCard';
import { PeerlistCard } from './PeerlistCard/PeerlistCard';
import Styles from './ReviewSection.module.css';

const ReviewSection = () => {
  const reviewCards = [
    {
      reviewText: "Amazing food recognition! The app instantly identified my dish and provided detailed nutritional information.",
      authorName: "Apas Dauren",
      authorImage: "/images/user1.png",
      rating: 5
    },
    {
      reviewText: "Love how easy it is to track my meals. Just snap a photo and get all the details!",
      authorName: "Akhmetaliyev Muslim", 
      authorImage: "/images/user2.jpg",
      rating: 5
    },
    {
      reviewText: "Perfect for my diet tracking. Very accurate results and clean interface.",
      authorName: "Munsyzbayev Daniyar",
      authorImage: "/images/user3.jpg", 
      rating: 4
    },
    {
      reviewText: "Great app for health-conscious people. Helps me make better food choices.",
      authorName: "Emily Davis",
      authorImage: "/images/user4.png",
      rating: 5
    }
  ];

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,
    defaultAnimation: {
      duration: 1500, // Увеличена длительность анимации для плавности
      easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 // easeInOutCubic
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
        }, 2000) // Уменьшен интервал для более частых переключений
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

  return (
    <div className={Styles.reviewSection}>
      <h2 className={Styles.title}>Reviews</h2>
      <div ref={sliderRef} className={`keen-slider ${Styles.slider}`}>
        {reviewCards.map((card, index) => (
          <div className="keen-slider__slide" key={`review-${index}`}>
            <ReviewCard {...card} />
          </div>
        ))}
        <div className="keen-slider__slide" key="peerlist">
          <PeerlistCard />
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
