"use client";

import React from "react";
import { Check, Copy } from "lucide-react";
import styles from "./RecipeStep.module.css";

export interface RecipeStepData {
  id: number;
  text: string;
  completed: boolean;
}

interface RecipeStepProps {
  step: RecipeStepData;
  stepNumber: number;
  onToggle: (stepId: number) => void;
  onCopy?: (text: string) => void;
}

export const RecipeStep: React.FC<RecipeStepProps> = ({ 
  step, 
  stepNumber, 
  onToggle,
  onCopy 
}) => {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(step.text);
    } else {
      navigator.clipboard.writeText(step.text);
    }
  };

  return (
    <div className={`${styles.stepContainer} ${step.completed ? styles.completed : ''}`}>
      <div className={styles.stepHeader}>
        <button
          className={`${styles.stepNumber} ${step.completed ? styles.stepNumberCompleted : ''}`}
          onClick={() => onToggle(step.id)}
          aria-label={`${step.completed ? 'Unmark' : 'Mark'} step ${stepNumber} as completed`}
        >
          {step.completed ? <Check size={16} /> : stepNumber}
        </button>
        
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Copy step text"
          title="Copy step"
        >
          <Copy size={14} />
        </button>
      </div>
      
      <div className={styles.stepContent}>
        <p className={styles.stepText}>{step.text}</p>
      </div>
    </div>
  );
};
