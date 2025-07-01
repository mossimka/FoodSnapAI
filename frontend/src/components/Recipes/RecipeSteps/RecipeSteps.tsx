"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw, CheckCircle } from "lucide-react";
import { RecipeStep, RecipeStepData } from "../RecipeStep/RecipeStep";
import styles from "./RecipeSteps.module.css";
import { toast } from "react-toastify";

interface RecipeStepsProps {
  recipeText: string;
  recipeId: number;
  recipeName: string;
}

export const RecipeSteps: React.FC<RecipeStepsProps> = ({ 
  recipeText, 
  recipeId, 
  recipeName 
}) => {
  const [steps, setSteps] = useState<RecipeStepData[]>([]);
  const storageKey = `recipe-progress-${recipeId}`;

  const parseRecipeSteps = useCallback((text: string): RecipeStepData[] => {
    if (!text?.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    return lines.map((line, index) => ({
      id: index + 1,
      text: line.trim(),
      completed: false,
    }));
  }, []);

  const loadProgress = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        return progressData.completedSteps || [];
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return [];
  }, [storageKey]);

  const saveProgress = useCallback((completedStepIds: number[]) => {
    try {
      const progressData = {
        recipeId,
        recipeName,
        completedSteps: completedStepIds,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [storageKey, recipeId, recipeName]);

  useEffect(() => {
    const parsedSteps = parseRecipeSteps(recipeText);
    const completedStepIds = loadProgress();
    
    const stepsWithProgress = parsedSteps.map(step => ({
      ...step,
      completed: completedStepIds.includes(step.id),
    }));
    
    setSteps(stepsWithProgress);
  }, [recipeText, parseRecipeSteps, loadProgress]);

  const toggleStep = useCallback((stepId: number) => {
    setSteps(prevSteps => {
      const updatedSteps = prevSteps.map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      );
      
      const completedStepIds = updatedSteps
        .filter(step => step.completed)
        .map(step => step.id);
      
      saveProgress(completedStepIds);
      return updatedSteps;
    });
  }, [saveProgress]);

  const resetProgress = useCallback(() => {
    setSteps(prevSteps => 
      prevSteps.map(step => ({ ...step, completed: false }))
    );
    localStorage.removeItem(storageKey);
    toast.success("Progress reset!");
  }, [storageKey]);

  const handleCopyStep = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Step copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy step");
    });
  }, []);

  const completedCount = steps.filter(step => step.completed).length;
  const totalCount = steps.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (steps.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Recipe Steps</h3>
        <div className={styles.noSteps}>
          <p>No steps available for this recipe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recipe Steps</h3>
        <button
          onClick={resetProgress}
          className={styles.resetButton}
          title="Reset progress"
          aria-label="Reset all steps progress"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>
            {completedCount} of {totalCount} steps completed
          </span>
          {completedCount === totalCount && totalCount > 0 && (
            <div className={styles.completedBadge}>
              <CheckCircle size={16} />
              Complete!
            </div>
          )}
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className={styles.stepsList}>
        {steps.map((step, index) => (
          <RecipeStep
            key={step.id}
            step={step}
            stepNumber={index + 1}
            onToggle={toggleStep}
            onCopy={handleCopyStep}
          />
        ))}
      </div>
    </div>
  );
};
