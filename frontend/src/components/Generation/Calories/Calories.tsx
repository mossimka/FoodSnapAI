"use client";

import React, { useEffect } from 'react';
import { createPortal } from "react-dom";
import { X, Scale, Flame, Users, Copy, TrendingUp, Utensils } from 'lucide-react';
import { toast } from "react-toastify";
import Styles from './Calories.module.css';

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

interface CaloriesProps {
  open: boolean;
  onClose: () => void;
  caloriesData: CaloriesData;
}

export const Calories: React.FC<CaloriesProps> = ({ open, onClose, caloriesData }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  const copyNutritionInfo = () => {
    const { ingredients_calories, estimated_weight_g, total_calories_per_100g, total_calories, dish_name } = caloriesData;
    
    const nutritionText = [
      dish_name ? `🍽️ ${dish_name}` : '',
      '',
      '📊 NUTRITION INFORMATION',
      estimated_weight_g ? `⚖️ Estimated weight: ${estimated_weight_g}g` : '',
      total_calories_per_100g ? `🔥 Calories per 100g: ${total_calories_per_100g} kcal` : '',
      total_calories ? `🔥 Total calories: ${total_calories} kcal` : '',
      '',
      '🧂 INGREDIENTS BREAKDOWN:',
      ...ingredients_calories.map(ing => `• ${ing.ingredient}: ${ing.calories} kcal/100g`),
    ].filter(line => line !== '').join('\n');
    
    copyToClipboard(nutritionText, "Nutrition information");
  };

  if (!open) return null;

  const { ingredients_calories, estimated_weight_g, total_calories_per_100g, total_calories, dish_name } = caloriesData;

  // Calculate additional metrics
  const totalIngredientsCalories = ingredients_calories.reduce((sum, ing) => sum + ing.calories, 0);
  const avgCaloriesPerIngredient = ingredients_calories.length > 0 
    ? Math.round(totalIngredientsCalories / ingredients_calories.length) 
    : 0;

  const caloriesPopup = (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>
          <div className={Styles.titleSection}>
            <Utensils className={Styles.titleIcon} />
            <h2 className={Styles.title}>
              {dish_name ? `${dish_name} - Nutrition Info` : 'Nutrition Information'}
            </h2>
          </div>
          <div className={Styles.headerButtons}>
            <button
              onClick={copyNutritionInfo}
              className={Styles.copyButton}
              title="Copy all nutrition info"
            >
              <Copy size={18} />
            </button>
            <button className={Styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={24} />
            </button>
          </div>
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

          <div className={Styles.summaryCard}>
            <TrendingUp className={Styles.cardIcon} />
            <div className={Styles.cardContent}>
              <span className={Styles.cardLabel}>Avg per Ingredient</span>
              <span className={Styles.cardValue}>
                {avgCaloriesPerIngredient > 0 ? `${avgCaloriesPerIngredient} kcal` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Ingredients Table */}
        <div className={Styles.tableSection}>
          <div className={Styles.tableHeader}>
            <h3 className={Styles.tableTitle}>
              <span className={Styles.emoji}>🧂</span>
              Ingredients Breakdown
            </h3>
            <span className={Styles.ingredientCount}>
              {ingredients_calories.length} ingredients
            </span>
          </div>

          <div className={Styles.tableContainer}>
            <table className={Styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ingredient</th>
                  <th>Calories (per 100g)</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {ingredients_calories.map((item, idx) => {
                  const percentage = totalIngredientsCalories > 0 
                    ? Math.round((item.calories / totalIngredientsCalories) * 100)
                    : 0;
                  
                  return (
                    <tr key={idx} className={Styles.tableRow}>
                      <td className={Styles.indexCell}>{idx + 1}</td>
                      <td className={Styles.ingredientCell}>
                        <div className={Styles.ingredientName}>{item.ingredient}</div>
                      </td>
                      <td className={Styles.caloriesCell}>
                        <span className={Styles.caloriesValue}>{item.calories}</span>
                        <span className={Styles.caloriesUnit}>kcal</span>
                      </td>
                      <td className={Styles.percentageCell}>
                        <div className={Styles.percentageBar}>
                          <div 
                            className={Styles.percentageFill}
                            style={{ width: `${percentage}%` }}
                          />
                          <span className={Styles.percentageText}>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with totals */}
        <div className={Styles.footer}>
          <div className={Styles.totalSection}>
            <span className={Styles.totalLabel}>Total Ingredients Calories:</span>
            <span className={Styles.totalValue}>{totalIngredientsCalories} kcal/100g</span>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(caloriesPopup, document.body)
    : null;
};
