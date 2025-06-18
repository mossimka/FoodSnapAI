import React, { useState } from 'react';
import { save_recipe } from '@/services/generateService';
import type { RecipeOutput } from '@/services/generateService';

interface Props {
  file: File;
  recipePart: RecipeOutput;
}

export const SaveRecipeButton: React.FC<Props> = ({ file, recipePart }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
    setIsSaving(true);
    try {
        await save_recipe({ file, recipePart });
        alert("✅ Recipe saved successfully!");
    } catch (err: unknown) {
        alert("❌ Failed to save recipe. Error:" + err);
    } finally {
        setIsSaving(false);
    }
    };

  return (
    <div>
        <button onClick={handleSave} disabled={isSaving} className="button" style={{ marginTop: "3vh" }}>
        {isSaving ? "Saving..." : "Save recipe"}
        </button>
    </div>
  );
};
