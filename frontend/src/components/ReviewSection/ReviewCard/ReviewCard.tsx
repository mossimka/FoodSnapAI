import React from 'react';
import Image from 'next/image';
import Styles from './ReviewCard.module.css';

interface ReviewCardProps {
  reviewText: string;
  authorName: string;
  authorImage: string;
  rating?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  reviewText, 
  authorName, 
  authorImage, 
  rating = 5 
}) => {
  return (
    <div className={Styles.card}>
      <div className={Styles.header}>
        <Image 
          src={authorImage} 
          alt={authorName}
          width={50}
          height={50}
          className={Styles.authorImage}
        />
        <div className={Styles.authorInfo}>
          <h4 className={Styles.authorName}>{authorName}</h4>
          <div className={Styles.rating}>
            {Array.from({ length: rating }, (_, i) => (
              <span key={i} className="gradientText">★</span>
            ))}
          </div>
        </div>
      </div>
      <p className={Styles.reviewText}>{reviewText}</p>
    </div>
  );
};