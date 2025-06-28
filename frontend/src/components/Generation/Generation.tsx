"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AxiosError } from "axios";

import DropZone from "./DropZone/DropZone";
import CameraCapture from "./CameraCapture/CameraCapture";
import { SaveRecipeButton } from "./SaveRecipeButton/SaveRecipeButton";
import Styles from "./Generation.module.css";
import { SignPopup } from "@/components/SignPopup/SignPopup";
import { useAuthStore } from "@/stores/authStore";
import { generate_recipe } from "@/services/generateService";
import { RecipeOutput, isNotFoodResponse, isGenerationOutput } from "@/interfaces/recipe";
import { NavButton } from "../Navbar/NavButton/NavButton";
import { Printer } from "../Style/Printer/Printer";
import { truncateFilename } from '@/utils/stringUtils';
import { compressImage } from '@/utils/imageUtils';
import { Calories } from "./Calories/Calories";
import { ShowCaloriesButton } from "./Calories/ShowCaloriesButton/ShowCaloriesButton";

export const Generation = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeGenerates, setRecipeGenerates] = useState(false);
  const [responseText, setResponseText] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCalories, setShowCalories] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeOutput | null>(null);

  const { isAuthenticated } = useAuthStore();

  const handleImageSelect = async (file: File) => {
    try {
      console.log('Original file:', file.name, file.size, file.type);
      
      const compressedFile = await compressImage(file);
      console.log('Compressed file:', compressedFile.name, compressedFile.size, compressedFile.type);
      
      // Проверка валидности файла
      if (!compressedFile.type.startsWith('image/')) {
        throw new Error('Invalid image type after compression');
      }
      
      setImageFile(compressedFile);
      const previewURL = URL.createObjectURL(compressedFile);
      setImagePreview(previewURL);
      setImageError(false);
      
    } catch (error) {
      console.error('Image processing failed:', error);
      setImageError(true);
    }
    
    setIsLoading(true);
    setRecipeGenerates(false);
    setIsGenerating(false);
    setResponseText("");
    setHasGenerated(false);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

const generateResponse = async () => {
  if (!isAuthenticated) {
    setShowPopup(true);
    return;
  }

  if (!imageFile) return;

  setRecipeGenerates(true);
  setIsGenerating(true);

  setTimeout(async () => {
    try {
      const res = await generate_recipe(imageFile);
      
      if (isNotFoodResponse(res)) {
        const formattedText = `🚫 This doesn't look like food.\n\n🔍 Detected: ${res.description}`;
        setResponseText(formattedText);
        setHasGenerated(true);
        setGeneratedRecipe(null);
        return;
      }

      if (isGenerationOutput(res)) {
        const ingredients_calories_array = Object.entries(res.calories.ingredients_calories).map(
          ([ingredient, calories]) => ({
            ingredient,
            calories
          })
        );

        const finalRecipe = {
          ...res.recipe,
          ingredients_calories: ingredients_calories_array,
          estimated_weight_g: res.calories.estimated_weight_g ?? null,
          total_calories_per_100g: res.calories.total_calories_per_100g ?? null,
        };

        setGeneratedRecipe(finalRecipe);

        const formattedText = [
          `🍽️ Dish: ${finalRecipe.dish_name}`,
          ``,
          ` 🧂 Ingredients & Calories:`,
          ...finalRecipe.ingredients_calories.map((i) => `- ${i.ingredient}`),
          ``,
          `⚖️ Estimated weight: ${finalRecipe.estimated_weight_g}g`,
          `🔥 Calories per 100g: ${finalRecipe.total_calories_per_100g} kcal`,     
          `🔥 Total calories: ${finalRecipe.total_calories_per_100g * (finalRecipe.estimated_weight_g / 100)} kcal`,
          `📋 Recipe:`,
          ...finalRecipe.recipe.split("\n"),
        ].join("\n");

        setResponseText(formattedText);
        setHasGenerated(true);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail: string }>;
      console.error("Error while generating recipe", err);
      setResponseText("❌ Failed to generate recipe. Please try again.");
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  }, 0);
};

  

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.wrapperActions}>
        <DropZone setImage={handleImageSelect} />
        <CameraCapture setImage={handleImageSelect} />
      </div>

      {imagePreview && (
        <div className={Styles.preview}>
          <p className="gradientText">You chose file: {truncateFilename(imageFile?.name)}</p>

          <div className={Styles.imageContainer}>
            {isLoading && (
              <div className={Styles.loaderOverlay}>
                <Image src="/images/loader.gif" alt="Loading..." width={128} height={50} />
              </div>
            )}

            <Image
              src={imagePreview}
              alt="Uploaded preview"
              className={Styles.previewImage}
              fill
              onLoadingComplete={() => {
                setTimeout(() => {
                  setIsLoading(false);
                }, 2000);
              }}
            />
          </div>

          {!isLoading && (
            <button
              className="button"
              onClick={generateResponse}
              disabled={isGenerating || hasGenerated}
            >
              {isGenerating ? "Generating..." : hasGenerated ? "Generated" : "Generate"}
            </button>
          )}
        </div>
      )}

      {recipeGenerates && (
        <div className={Styles.responseBox}>
          {isGenerating ? (
            <Image src="/images/loader.gif" alt="Generating..." width={128} height={50} />
          ) : (
            <div className={Styles.responseBoxContainer}>
              <Printer initialText={responseText} speed={10}/>
              {generatedRecipe && (
                <div className={Styles.action}>
                  <div>
                    <ShowCaloriesButton
                      onClick={() => setShowCalories(true)}
                      style={{ marginTop: "3vh" }}
                    />
                  </div>
                  <SaveRecipeButton 
                    file={imageFile!} 
                    recipePart={generatedRecipe!}
                  />
                  <NavButton text="Go to my recipies" link="/posted" inputStyle={{ marginTop: "3vh" }} />
                  <Calories
                    open={showCalories}
                    onClose={() => setShowCalories(false)}
                    caloriesData={generatedRecipe}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showPopup && <SignPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};
