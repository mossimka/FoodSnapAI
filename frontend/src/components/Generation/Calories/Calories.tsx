"use client";

import React, { useEffect } from 'react';
import { createPortal } from "react-dom";
import Styles from './Calories.module.css';
import { X } from 'lucide-react';

interface IngredientCalories {
  ingredient: string;
  calories: number;
}

interface CaloriesData {
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

  if (!open) return null;
  const { ingredients_calories, estimated_weight_g, total_calories_per_100g, total_calories } = caloriesData;

  const caloriesPopup = (
    <div className={Styles.overlay} onClick={onClose} >
      <div className={Styles.popup}>
        <button className={Styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        <h2>Calories Table</h2>
        <table className={Styles.table}>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Calories (kcal/100g)</th>
            </tr>
          </thead>
          <tbody>
            {ingredients_calories.map((item, idx) => (
              <tr key={idx}>
                <td>{item.ingredient}</td>
                <td>{item.calories}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={Styles.summary}>
          {estimated_weight_g && (
            <div>Estimated weight: <b>{estimated_weight_g} g</b></div>
          )}
          {total_calories_per_100g && (
            <div>Calories per 100g: <b>{total_calories_per_100g} kcal</b></div>
          )}
          {total_calories && (
            <div>Total calories: <b>{total_calories} kcal</b></div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(caloriesPopup, document.body)
    : null;
};
