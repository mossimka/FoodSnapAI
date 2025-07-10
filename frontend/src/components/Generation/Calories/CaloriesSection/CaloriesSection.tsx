"use client";

import React from 'react';
import { Scale, Flame, Users, Copy, Utensils } from 'lucide-react';
import { toast } from "react-toastify";
import Styles from './CaloriesSection.module.css';

interface IngredientCalories {
  ingredient: string;
  calories: number;
}

interface CaloriesData {
  dish_name?: string;
  ingredients_calories: IngredientCalories[];
  estimated_weight_g?: number | null;
  total_calories_per_100g?: number | null;
  total_calories?: number | null;
}

interface CaloriesSectionProps {
  caloriesData: CaloriesData;
}

export const CaloriesSection: React.FC<CaloriesSectionProps> = ({ caloriesData }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  const copyNutritionInfo = () => {
    const { estimated_weight_g, total_calories_per_100g, total_calories, dish_name } = caloriesData;
    
    const nutritionText = [
      dish_name ? `🍽️ ${dish_name}` : '',
      '',
      'NUTRITION INFORMATION',
      estimated_weight_g ? `⚖️ Estimated weight: ${estimated_weight_g}g` : '',
      total_calories_per_100g ? `🔥 Calories per 100g: ${total_calories_per_100g} kcal` : '',
      total_calories ? `🔥 Total calories: ${total_calories} kcal` : '',
    ].filter(line => line !== '').join('\n');
    
    copyToClipboard(nutritionText, "Nutrition information");
  };

  const { estimated_weight_g, total_calories_per_100g, total_calories} = caloriesData;

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <div className={Styles.titleSection}>
          <Utensils className={Styles.titleIcon} />
          <h3 className={Styles.title}>
            Nutrition Information
          </h3>
        </div>
        <button
          onClick={copyNutritionInfo}
          className={Styles.copyButton}
          title="Copy all nutrition info"
        >
          <Copy size={18} />
        </button>
      </div>

      {/* Nutrition Summary Cards */}
      <div className={Styles.summaryGrid}>
        <div className={Styles.summaryCard}>
          <Scale className={Styles.cardIcon} />
          <div className={Styles.cardContent}>
            <span className={Styles.cardLabel}>Estimated Weight</span>
            <span className={Styles.cardValue}>
              {estimated_weight_g ? `${estimated_weight_g}g` : 'N/A'}
            </span>
          </div>
        </div>

        <div className={Styles.summaryCard}>
          <Flame className={Styles.cardIcon} />
          <div className={Styles.cardContent}>
            <span className={Styles.cardLabel}>Per 100g</span>
            <span className={Styles.cardValue}>
              {total_calories_per_100g ? `${total_calories_per_100g} kcal` : 'N/A'}
            </span>
          </div>
        </div>

        <div className={Styles.summaryCard}>
          <Users className={Styles.cardIcon} />
          <div className={Styles.cardContent}>
            <span className={Styles.cardLabel}>Total Calories</span>
            <span className={Styles.cardValue}>
              {total_calories ? `${total_calories} kcal` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 