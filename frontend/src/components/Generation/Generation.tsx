"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AxiosError } from "axios";
import { motion, AnimatePresence } from 'framer-motion';

import DropZone from "./DropZone/DropZone";
import CameraCapture from "./CameraCapture/CameraCapture";
import { SaveRecipeButton } from "./SaveRecipeButton/SaveRecipeButton";
import { RecipeDisplay } from "./RecipeDisplay/RecipeDisplay";
import Styles from "./Generation.module.css";
import { SignPopup } from "@/components/SignPopup/SignPopup";
import { useAuthStore } from "@/stores/authStore";
import { generateRecipe } from "@/services/generateService";
import { RecipeOutput, isNotFoodResponse, isGenerationOutput } from "@/interfaces/recipe";
import { NavButton } from "../Navbar/NavButton/NavButton";
import { Printer } from "../Style/Printer/Printer";
import { truncateFilename } from '@/utils/stringUtils';
import { compressImage } from '@/utils/imageUtils';
import { 
  cacheImage, 
  getCachedImage, 
  clearImageCache, 
  hasCachedImage
} from '@/utils/imageCache';

export const Generation = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeGenerates, setRecipeGenerates] = useState(false);
  const [responseText, setResponseText] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isNotFood, setIsNotFood] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeOutput | null>(null);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadCachedImage = () => {
      if (hasCachedImage()) {
        const cached = getCachedImage();
        if (cached) {
          setImageFile(cached.file);
          setImagePreview(cached.previewUrl);
          setIsFromCache(true);
          setIsLoading(false);
          console.log('Loaded cached image:', cached.file.name);
        }
      }
    };

    loadCachedImage();
  }, []);

  const handleImageSelect = async (file: File) => {
    try {
      console.log('Original file:', file.name, file.size, file.type);
      
      const compressedFile = await compressImage(file);
      console.log('Compressed file:', compressedFile.name, compressedFile.size, compressedFile.type);
      
      if (!compressedFile.type.startsWith('image/')) {
        throw new Error('Invalid image type after compression');
      }
      
      // Clean up previous preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImageFile(compressedFile);
      const previewURL = URL.createObjectURL(compressedFile);
      setImagePreview(previewURL);
      setIsFromCache(false);
      
      // Cache the image for non-authenticated users
      if (!isAuthenticated) {
        await cacheImage(compressedFile);
      }
      
    } catch (error) {
      console.error('Image processing failed:', error);
    }
    
    setIsLoading(true);
    setRecipeGenerates(false);
    setIsGenerating(false);
    setResponseText("");
    setHasGenerated(false);
    setIsNotFood(false);
  };

  const handleClearImage = () => {
    setIsClearing(true);
    
    // Start fade-out animation, then clear after animation completes
    setTimeout(() => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImageFile(null);
      setImagePreview(null);
      setIsFromCache(false);
      setIsLoading(true);
      setRecipeGenerates(false);
      setIsGenerating(false);
      setResponseText("");
      setHasGenerated(false);
      setIsNotFood(false);
      setGeneratedRecipe(null);
      setIsClearing(false);
      
      // Clear cache
      clearImageCache();
    }, 300); // Match animation duration
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
      const res = await generateRecipe(imageFile);
      
      if (isNotFoodResponse(res)) {
        const formattedText = `🚫 This doesn't look like food.\n\n🔍 Detected: ${res.description}`;
        setResponseText(formattedText);
        setHasGenerated(true);
        setGeneratedRecipe(null);
        setIsNotFood(true);
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
        setHasGenerated(true);
        setIsNotFood(false);
        
        clearImageCache();
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail: string }>;
      console.error("Error while generating recipe", err);
      setResponseText("❌ Failed to generate recipe. Please try again.");
      setHasGenerated(true);
      setIsNotFood(true);
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

      <AnimatePresence mode="wait">
        {imagePreview && !isClearing && (
          <motion.div 
            className={Styles.preview}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className={Styles.previewHeader}>
              <p className="gradientText">
                You chose file: {truncateFilename(imageFile?.name)}
              </p>
              
              <button 
                className={Styles.clearButton}
                onClick={handleClearImage}
                title="Clear image and start over"
                disabled={isClearing}
              >
                ✕ Clear
              </button>
            </div>

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
                  if (!isFromCache) {
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 2000);
                  }
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
          </motion.div>
        )}
      </AnimatePresence>

      {recipeGenerates && (
        <div className={Styles.responseBox}>
          {isGenerating ? (
            <Image src="/images/loader.gif" alt="Generating..." width={128} height={50} />
          ) : (
            <div className={Styles.responseBoxContainer}>
              {/* Show not food response or error with Printer */}
              {isNotFood && (
                <Printer initialText={responseText} speed={10}/>
              )}
              
              {/* Show beautiful recipe display */}
              {generatedRecipe && !isNotFood && (
                <>
                  <RecipeDisplay 
                    recipe={generatedRecipe} 
                    isAnimating={isGenerating}
                  />
                  <div className={Styles.action}>
                    <SaveRecipeButton 
                      file={imageFile!} 
                      recipePart={generatedRecipe!}
                    />
                    <NavButton text="Go to my recipies" link="/posted" inputStyle={{ marginTop: "3vh" }} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {showPopup && <SignPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};
