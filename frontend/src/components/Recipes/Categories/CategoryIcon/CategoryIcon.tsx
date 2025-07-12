import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HealthCategory } from '@/interfaces/recipe';
import styles from './CategoryIcon.module.css';
import { 
  Wheat,
  Zap, 
  Candy,
  Droplet,
  Flame,
  Beef,
  Leaf,
  MilkOff,
  Dumbbell,
  Nut
} from 'lucide-react';

interface Props {
  category: HealthCategory;
  size?: number;
  showLabel?: boolean;
}

const categoryIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "High in Fiber": Wheat,
  "High Sodium": Zap,
  "High Sugar": Candy,
  "High Saturated Fat": Droplet,
  "Spicy/Irritant": Flame,
  "Red Meat-Based": Beef,
  "Plant-Based": Leaf,
  "Dairy-Free": MilkOff,
  "High Protein": Dumbbell,
  "Contains Nuts": Nut
};

export const CategoryIcon: React.FC<Props> = ({ 
  category, 
  size = 20, 
  showLabel = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  
  const IconComponent = categoryIconMap[category.name as keyof typeof categoryIconMap];
  
  if (!IconComponent) {
    return null;
  }

  const handleMouseEnter = () => {
    if (!showLabel && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const tooltip = !showLabel && showTooltip && (
    <div
      className={styles.portalTooltip}
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: 'translateX(-50%) translateY(-100%)'
      }}
    >
      {category.name}
    </div>
  );

  return (
    <>
      <div 
        ref={iconRef}
        className={styles.categoryIcon} 
        data-category={category.name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <IconComponent size={size} />
        {showLabel && (
          <span className={styles.categoryLabel}>
            {category.name}
          </span>
        )}
      </div>
      {tooltip && typeof window !== 'undefined' && createPortal(tooltip, document.body)}
    </>
  );
};
