  import { IRecipe } from "@/interfaces/recipe";
  import { jsPDF } from "jspdf";
  import html2canvas from "html2canvas";
  import { base64Logo } from "@/consts/base64Logo";

  // Функция для получения изображения через прокси API
  const getImageViaProxy = async (recipeId: number): Promise<string | null> => {
    try {
      const response = await fetch(`/api/dish/image-proxy/${recipeId}/`);
      if (!response.ok) throw new Error('Failed to fetch image via proxy');
      
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Failed to get image via proxy:', error);
      return null;
    }
  };

  // Функция для конвертации изображения в base64
  const convertImageToBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Failed to convert image to base64:', error);
      return null;
    }
  };

  export const generatePDF = async (recipe: IRecipe, filename: string): Promise<void> => {
    try {
      // Создаем HTML элемент для рендеринга
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.background = 'white';
      container.style.padding = '40px';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.color = '#333';
      container.style.lineHeight = '1.6';
      
      const totalCalories = recipe.total_calories_per_100g && recipe.estimated_weight_g
        ? Math.round((recipe.total_calories_per_100g * recipe.estimated_weight_g) / 100)
        : null;

      const parseRecipeSteps = (text: string): string[] => {
        if (!text?.trim()) return [];
        return text.split('\n').filter(line => line.trim().length > 0);
      };

      const recipeSteps = parseRecipeSteps(recipe.recipe);

      // Пытаемся получить изображение через прокси или напрямую
      let imageData = null;
      if (recipe.image_path && recipe.id) {
        try {
          // Сначала пробуем через прокси
          imageData = await getImageViaProxy(recipe.id);
          if (!imageData) {
            // Если прокси не сработал, пробуем напрямую
            imageData = await convertImageToBase64(recipe.image_path);
          }
        } catch (error) {
          console.warn('Failed to load image:', error);
        }
      }

      // Создаем простую HTML разметку
      container.innerHTML = `
        <div style="max-width: 100%;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f4f4f4;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${base64Logo}" alt="FoodSnapAI" style="width: 32px; height: 32px; object-fit: contain;" />
              <h1 style="font-size: 24px; font-weight: 700; color: #f48a3b; margin: 0;">FoodSnapAI</h1>
            </div>
            <div style="text-align: right; max-width: 60%;">
              <h2 style="font-size: 28px; font-weight: 600; color: #333; margin: 0 0 8px 0; line-height: 1.2;">${recipe.dish_name}</h2>
              <p style="font-size: 16px; color: #666; margin: 0;">by ${recipe.user.username}</p>
            </div>
          </div>
          
          <!-- Content -->
          <div style="margin-bottom: 30px;">
            <div style="display: flex; gap: 30px; margin-bottom: 40px; align-items: flex-start;">
              ${imageData ? `
                <div style="flex-shrink: 0; width: 200px;">
                  <img src="${imageData}" alt="${recipe.dish_name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 12px; border: 1px solid #e0e0e0;" />
                </div>
              ` : ''}
              
              <div style="flex: 1;">
                ${recipe.categories && recipe.categories.length > 0 ? `
                  <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: #333; margin: 0 0 15px 0;">🏷️ Health Categories</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                      ${recipe.categories.map(category => `
                        <span style="background: linear-gradient(135deg, #f48a3b, #ff6b35); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${category.name}</span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
                
                <div>
                  <h3 style="font-size: 18px; font-weight: 600; color: #333; margin: 0 0 15px 0;">⚖️ Nutrition Information</h3>
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                    <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; text-align: center;">
                      <span style="display: block; font-size: 12px; color: #666; font-weight: 500; margin-bottom: 5px;">Estimated Weight</span>
                      <span style="display: block; font-size: 16px; font-weight: 600; color: #333;">${recipe.estimated_weight_g ? `${recipe.estimated_weight_g}g` : 'N/A'}</span>
                    </div>
                    <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; text-align: center;">
                      <span style="display: block; font-size: 12px; color: #666; font-weight: 500; margin-bottom: 5px;">Per 100g</span>
                      <span style="display: block; font-size: 16px; font-weight: 600; color: #333;">${recipe.total_calories_per_100g ? `${recipe.total_calories_per_100g} kcal` : 'N/A'}</span>
                    </div>
                    <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; text-align: center;">
                      <span style="display: block; font-size: 12px; color: #666; font-weight: 500; margin-bottom: 5px;">Total Calories</span>
                      <span style="display: block; font-size: 16px; font-weight: 600; color: #333;">${totalCalories ? `${totalCalories} kcal` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Ingredients -->
            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 20px; font-weight: 600; color: #333; margin: 0 0 20px 0;">🧂 Ingredients</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                ${recipe.ingredients_calories.map(item => `
                  <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500; color: #333; font-size: 14px; flex: 1;">${item.ingredient}</span>
                    <span style="font-size: 12px; color: #666; font-weight: 500; background: rgba(244, 138, 59, 0.1); padding: 4px 8px; border-radius: 4px; white-space: nowrap;">${item.calories} cal/100g</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Recipe Steps -->
            <div>
              <h3 style="font-size: 20px; font-weight: 600; color: #333; margin: 0 0 20px 0;">👨‍🍳 Recipe Steps</h3>
              <div style="display: flex; flex-direction: column; gap: 15px;">
                ${recipeSteps.map((step, index) => `
                  <div style="display: flex; gap: 15px; align-items: flex-start; padding: 15px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;">
                    <span style="background: #f48a3b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;">${index + 1}</span>
                    <span style="font-size: 14px; color: #333; line-height: 1.5; flex: 1;">${step}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0;">Generated by FoodSnapAI • ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      // Ждем загрузки изображений с обработкой ошибок
      const images = container.querySelectorAll('img');
      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map(img => {
            return new Promise((resolve) => {
              const timeout = setTimeout(() => {
                console.warn('Image load timeout, continuing without image');
                resolve(null);
              }, 3000);
              
              if (img.complete) {
                clearTimeout(timeout);
                resolve(null);
              } else {
                img.onload = () => {
                  clearTimeout(timeout);
                  resolve(null);
                };
                img.onerror = () => {
                  clearTimeout(timeout);
                  console.warn('Image failed to load, continuing without image');
                  img.style.display = 'none';
                  img.parentElement!.style.display = 'none';
                  resolve(null);
                };
              }
            });
          })
        );
      }

      // Конвертируем в canvas с улучшенными настройками
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: container.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        imageTimeout: 0, // Отключаем таймаут для изображений
        removeContainer: false
      });

      // Создаем PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);

      // Очищаем
      document.body.removeChild(container);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  };