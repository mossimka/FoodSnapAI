# 🎯 Примеры использования TanStack Query

## ✅ Проблема решена!
Ошибка "Only plain objects, and a few built-ins, can be passed to Client Components" исправлена созданием отдельного Client Component `<Providers>`.

## 📊 Как использовать в компонентах:

### 1. **Простой список рецептов (GET):**

```tsx
// components/RecipeList.tsx
'use client';

import { usePublicRecipes } from '@/hooks/queries/useRecipes';

export function RecipeList() {
  const { data: recipes, isLoading, error } = usePublicRecipes();

  if (isLoading) return <div>Загружаем рецепты... 🍳</div>;
  if (error) return <div>Ошибка: {error.message} 😔</div>;

  return (
    <div>
      <h2>Публичные рецепты ({recipes?.length || 0})</h2>
      {recipes?.map(recipe => (
        <div key={recipe.id} className="recipe-card">
          <h3>{recipe.dish_name}</h3>
          <p>by {recipe.user.username}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. **Форма создания рецепта (POST):**

```tsx
// components/CreateRecipeForm.tsx
'use client';

import { useCreateRecipe } from '@/hooks/queries/useRecipes';

export function CreateRecipeForm() {
  const createRecipe = useCreateRecipe();

  const handleSubmit = (formData: FormData) => {
    const recipeData = {
      file: formData.get('image') as File,
      recipePart: {
        dish_name: formData.get('name') as string,
        recipe: formData.get('recipe') as string,
        // ... другие поля
      }
    };

    createRecipe.mutate(recipeData, {
      onSuccess: () => {
        // Автоматически обновится список "Мои рецепты"
        router.push('/my-recipes');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* поля формы */}
      <button 
        type="submit" 
        disabled={createRecipe.isPending}
      >
        {createRecipe.isPending ? 'Сохраняем... ⏳' : 'Сохранить рецепт 💾'}
      </button>
      
      {createRecipe.error && (
        <p className="error">Ошибка: {createRecipe.error.message}</p>
      )}
    </form>
  );
}
```

### 3. **Кнопка удаления с optimistic update:**

```tsx
// components/DeleteButton.tsx
'use client';

import { useDeleteRecipe } from '@/hooks/queries/useRecipes';

interface DeleteButtonProps {
  recipeId: number;
  recipeName: string;
}

export function DeleteButton({ recipeId, recipeName }: DeleteButtonProps) {
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = () => {
    if (confirm(`Удалить рецепт "${recipeName}"?`)) {
      // Рецепт исчезнет из UI мгновенно (optimistic update)
      deleteRecipe.mutate(recipeId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deleteRecipe.isPending}
      className="delete-btn"
    >
      {deleteRecipe.isPending ? '🗑️ Удаляем...' : '🗑️ Удалить'}
    </button>
  );
}
```

## 🔄 Преимущества которые вы получили:

### **Автоматическое кеширование:**
```tsx
// Данные загружаются только 1 раз, потом берутся из кеша
function Page1() {
  const { data } = usePublicRecipes(); // 🌐 API call
}

function Page2() {
  const { data } = usePublicRecipes(); // ⚡ Из кеша!
}
```

### **Background updates:**
```tsx
// Данные обновляются в фоне, UI остается отзывчивым
function RecipeList() {
  const { data, isFetching } = usePublicRecipes();
  
  return (
    <div>
      <h2>
        Рецепты 
        {isFetching && <span>🔄</span>} {/* Показываем что обновляется */}
      </h2>
      {/* Показываем старые данные пока загружаются новые */}
      {data?.map(recipe => <RecipeCard key={recipe.id} {...recipe} />)}
    </div>
  );
}
```

### **Automatic invalidation:**
```tsx
// При сохранении нового рецепта - список автоматически обновится
const createRecipe = useCreateRecipe(); // Внутри есть invalidateQueries
const { data: myRecipes } = useMyRecipes(); // Автоматически обновится
```

## 🎨 Следующие шаги:

1. **Замените существующие API calls:**
   - В `settings/page.tsx` используйте mutations
   - В recipe компонентах используйте queries
   
2. **Добавьте dev tools:**
   - Уже настроены в `<Providers>`
   - Откройте React Query DevTools в браузере

3. **Оптимизируйте UX:**
   - Добавьте skeleton loaders
   - Используйте optimistic updates
   - Настройте error boundaries

## 🚀 Попробуйте прямо сейчас:

Используйте `usePublicRecipes()` в любом компоненте вместо прямого API call!

```tsx
// БЫЛО:
const [recipes, setRecipes] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    const data = await get_public_recipes();
    setRecipes(data);
  };
  fetchData();
}, []);

// СТАЛО:
const { data: recipes } = usePublicRecipes();
``` 