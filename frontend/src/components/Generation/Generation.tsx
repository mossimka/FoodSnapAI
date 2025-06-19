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
import { RecipeOutput } from "@/interfaces/recipe";

export const Generation = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeGenerates, setRecipeGenerates] = useState(false);
  const [responseText, setResponseText] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 

  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeOutput | null>(null);

  const { isAuthenticated } = useAuthStore();

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
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

  try {
    setRecipeGenerates(true);
    setIsGenerating(true);

  const res = await generate_recipe(imageFile);
  setGeneratedRecipe(res);

  console.log("👉 recipe", res.dish_name);
  console.log("👉 recipe.ingredients", res?.ingredients);


  const formattedText = [
    `🍽️ Dish: ${res.dish_name}`,
    ``,
    `🧂 Ingredients:`,
    ...res.ingredients.map(ing => `- ${ing}`),
    ``,
    `📋 Recipe:`,
    ...res.recipe.split("\n"),
  ].join("\n");

    setResponseText(formattedText);
    setHasGenerated(true);
  } catch (error: unknown) {
    const err = error as AxiosError<{ detail: string }>;
    throw new Error(err.response?.data?.detail || "Failed to generate recipe");
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.wrapperActions}>
        <DropZone setImage={handleImageSelect} />
        <CameraCapture setImage={handleImageSelect} />
      </div>

      {imagePreview && (
        <div className={Styles.preview}>
          <p className="gradientText">You chose file: {imageFile?.name}</p>

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
              <pre className={Styles.responseText}>
                {responseText}
              </pre>
              <SaveRecipeButton 
                file={imageFile!} 
                recipePart={generatedRecipe!}
              />
            </div>
          )}
        </div>
      )}

      {showPopup && <SignPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};
