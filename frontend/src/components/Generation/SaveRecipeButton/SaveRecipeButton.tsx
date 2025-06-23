import React, { useState } from 'react';
import { save_recipe } from '@/services/generateService';
import { RecipeOutput } from '@/interfaces/recipe';

interface Props {
  file: File;
  recipePart: RecipeOutput;
}

export const SaveRecipeButton: React.FC<Props> = ({ file, recipePart }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      try {
        await save_recipe({ file, recipePart });
        setIsSaved(true);
        alert("✅ Recipe saved successfully!");
      } catch (err: unknown) {
        alert("❌ Failed to save recipe. Error:" + err);
      } finally {
        setIsSaving(false);
      }
    };

  return (
    <div>
        <button onClick={handleSave} disabled={isSaving || isSaved} className="buttonGreen" style={{ marginTop: "3vh" }}>
        {isSaving ? "Saving..." : isSaved ? "Saved" : "Save recipe"}
        </button>
    </div>
  );
};
