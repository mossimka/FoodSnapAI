"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Info, Leaf, Activity } from "lucide-react";
import { OpenFoodFactsProduct } from "@/services/openFoodFactsService";
import Styles from "./ProductDisplay.module.css";

interface ProductDisplayProps {
  product: OpenFoodFactsProduct;
  onClose: () => void;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({ product, onClose }) => {
  const getProductName = () => {
    return product.product_name_en || product.product_name || "Unknown Product";
  };

  const getIngredients = () => {
    return product.ingredients_text_en || product.ingredients_text || "No ingredients available";
  };

  const getNutritionGrade = () => {
    if (!product.nutrition_grades) return null;
    const grade = product.nutrition_grades.toUpperCase();
    return grade;
  };

  const getEcoScore = () => {
    if (!product.ecoscore_grade) return null;
    return product.ecoscore_grade.toUpperCase();
  };

  const formatNutriment = (value: number | undefined, unit: string = "g") => {
    if (value === undefined) return "N/A";
    return `${value}${unit}`;
  };

  // Block scroll when component mounts, unblock when unmounts
  useEffect(() => {
    // Block scroll
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className={Styles.productDisplay}>
      <div className={Styles.productHeader}>
        <h2 className={Styles.productTitle}>{getProductName()}</h2>
        <button onClick={onClose} className="buttonRed">
          Close
        </button>
      </div>

      <div className={Styles.productContent}>
        <div className={Styles.productImageSection}>
          <div className={Styles.productImageContainer}>
            {(product.image_front_url || product.image_url) && (
              <div className={Styles.productImage}>
                <Image
                  src={product.image_front_url || product.image_url || ""}
                  alt={getProductName()}
                  width={200}
                  height={200}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
            
            <div className={Styles.grades}>
              {getNutritionGrade() && (
                <div className={`${Styles.grade} ${Styles.nutritionGrade}`}>
                  <span className={Styles.gradeLabel}>Nutri-Score:</span>
                  <span className={`${Styles.gradeValue} ${Styles[`grade${getNutritionGrade()}`]}`}>
                    {getNutritionGrade()}
                  </span>
                </div>
              )}
              {getEcoScore() && (
                <div className={`${Styles.grade} ${Styles.ecoGrade}`}>
                  <span className={Styles.gradeLabel}>Eco-Score:</span>
                  <span className={`${Styles.gradeValue} ${Styles[`eco${getEcoScore()}`]}`}>
                    {getEcoScore()}
                  </span>
                </div>
              )}
            </div>

            <div className={Styles.ingredientsSection}>
              <h3>
                <Leaf className={Styles.sectionIcon} size={20} />
                Ingredients
              </h3>
              <p className={Styles.ingredients}>{getIngredients()}</p>
            </div>
          </div>
        </div>

        <div className={Styles.productInfo}>
          <div className={Styles.infoSection}>
            <h3>
              <Info className={Styles.sectionIcon} size={20} />
              Basic Information
            </h3>
            <div className={Styles.infoGrid}>
              <div className={Styles.infoItem}>
                <span className={Styles.label}>Barcode:</span>
                <span className={Styles.value}>{product.code}</span>
              </div>
              {product.brands && (
                <div className={Styles.infoItem}>
                  <span className={Styles.label}>Brand:</span>
                  <span className={Styles.value}>{product.brands}</span>
                </div>
              )}
              {product.categories && (
                <div className={Styles.infoItem}>
                  <span className={Styles.label}>Categories:</span>
                  {product.categories.length > 30 
                  ?  <span className={Styles.value}>{product.categories.slice(0, 30)}...</span>
                  : <span className={Styles.value}>{product.categories}</span>}
                  
                </div>
              )}
            </div>
          </div>

          {product.nutriments && (
            <div className={Styles.infoSection}>
              <h3>
                <Activity className={Styles.sectionIcon} size={20} />
                Nutrition (per 100g)
              </h3>
              <div className={Styles.nutritionGrid}>
                <div className={Styles.nutritionItem}>
                  <span className={Styles.label}>Energy:</span>
                  <span className={Styles.value}>
                    {formatNutriment(product.nutriments.energy_100g, product.nutriments.energy_unit || "kJ")}
                  </span>
                </div>
                <div className={Styles.nutritionItem}>
                  <span className={Styles.label}>Proteins:</span>
                  <span className={Styles.value}>{formatNutriment(product.nutriments.proteins_100g)}</span>
                </div>
                <div className={Styles.nutritionItem}>
                  <span className={Styles.label}>Carbohydrates:</span>
                  <span className={Styles.value}>{formatNutriment(product.nutriments.carbohydrates_100g)}</span>
                </div>
                <div className={Styles.nutritionItem}>
                  <span className={Styles.label}>Fat:</span>
                  <span className={Styles.value}>{formatNutriment(product.nutriments.fat_100g)}</span>
                </div>
                <div className={Styles.nutritionItem}>
                  <span className={Styles.label}>Fiber:</span>
                  <span className={Styles.value}>{formatNutriment(product.nutriments.fiber_100g)}</span>
                </div>
                <div className={Styles.nutritionItem}>
                  <span className={Styles.label}>Salt:</span>
                  <span className={Styles.value}>{formatNutriment(product.nutriments.salt_100g)}</span>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}; 