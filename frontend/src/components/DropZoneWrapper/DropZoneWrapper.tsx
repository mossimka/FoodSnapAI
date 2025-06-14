"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import DropZone from "./DropZone/DropZone";
import CameraCapture from "./CameraCapture/CameraCapture";
import Styles from "./DropZoneWrapped.module.css";

export const DropZoneWrapper = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeGenerates, setRecipeGenerates] = useState(false);
  const [responseText, setResponseText] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false); 

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
    setIsLoading(true);
    setRecipeGenerates(false);
    setIsGenerating(false);
    setResponseText("");
    setHasGenerated(false)
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const generateResponse = () => {
    setRecipeGenerates(true);
    setIsGenerating(true);

    setTimeout(() => {
      setResponseText("Recip[e genration will be there soon!");
      setIsGenerating(false);
      setHasGenerated(true); 
    }, 3000);
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
            <p>{responseText}</p>
          )}
        </div>
      )}
    </div>
  );
};
