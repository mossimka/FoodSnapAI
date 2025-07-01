# SEO Рекомендации для FoodSnap AI

## ✅ Реализованные SEO функции

### 1. **XML Sitemap** (`/sitemap.xml`)
- ✅ Динамическая генерация на основе реальных рецептов из БД
- ✅ Только существующие страницы (/, /generate, /posted, /signin, /signup)
- ✅ Правильные приоритеты страниц (homepage: 1.0, generate: 0.9, posted: 0.8)
- ✅ Частота обновлений (daily, weekly, monthly)
- ✅ Поддержка изображений в sitemap для рецептов
- ✅ Ограничение до 100 рецептов для производительности
- ✅ Автоматическое обновление дат

### 2. **Robots.txt** (`/robots.txt`)
- ✅ Разрешены только реальные страницы для краулеров
- ✅ Заблокированы приватные страницы (/profile, /settings)
- ✅ Настроены правила для основных ботов (Google, Bing, DuckDuck)
- ✅ Заблокированы агрессивные краулеры (SemrushBot, AhrefsBot)
- ✅ Разрешены социальные краулеры (Facebook, Twitter, LinkedIn)
- ✅ Указана ссылка на sitemap

### 3. **Structured Data** (`/structured-data.json`)
- ✅ Упрощенная JSON-LD разметка для поисковиков
- ✅ Schema.org данные для WebSite и Organization
- ✅ Structured data для реальных рецептов с питательной информацией
- ✅ Социальные ссылки в Organization schema

### 4. **PWA Manifest** (`/manifest.json`)
- ✅ Поддержка установки как PWA приложение
- ✅ Настроенные иконки и цвета бренда
- ✅ Категории приложения

## 🚀 Рекомендации для дальнейшего улучшения

### 1. **Meta теги для каждой страницы**
```html
<!-- В каждый page.tsx добавить Head с meta тегами -->
<Head>
  <title>Название страницы | FoodSnap AI</title>
  <meta name="description" content="Описание страницы до 160 символов" />
  <meta name="keywords" content="ai recipes, food, cooking, recipe generator" />
  
  <!-- Open Graph для социальных сетей -->
  <meta property="og:title" content="Название страницы" />
  <meta property="og:description" content="Описание для соцсетей" />
  <meta property="og:image" content="https://foodsnapai.food/images/og-image.jpg" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Название страницы" />
  <meta name="twitter:description" content="Описание для Twitter" />
  <meta name="twitter:image" content="https://foodsnapai.food/images/twitter-image.jpg" />
</Head>
```

### 2. **Улучшение существующих страниц**
- Добавить SEO meta теги на каждую страницу
- Улучшить контент главной страницы
- Оптимизировать страницу генерации рецептов
- Добавить больше контента на страницу с рецептами

### 3. **Улучшение страниц рецептов**
```tsx
// Добавить в RecipePage.tsx структурированные данные
const recipeStructuredData = {
  "@context": "https://schema.org/",
  "@type": "Recipe",
  "name": recipe.dish_name,
  "image": recipe.image_path,
  "author": {
    "@type": "Person",
    "name": recipe.user.username
  },
  "datePublished": recipe.created_at,
  "description": `AI-generated recipe for ${recipe.dish_name}`,
  "recipeIngredient": recipe.ingredients_calories.map(i => i.ingredient),
  "recipeInstructions": recipe.recipe.split('\n').map(step => ({
    "@type": "HowToStep",
    "text": step
  })),
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": recipe.total_calories_per_100g
  }
};
```

### 4. **Поиск и фильтрация рецептов**
Улучшить функциональность страницы /posted:
- Добавить поиск по названию рецепта
- Добавить фильтры по ингредиентам
- Сортировка по дате создания
- Пагинация для большого количества рецептов

### 5. **Оптимизация изображений**
- Добавить alt теги ко всем изображениям
- Использовать WebP формат для лучшей производительности
- Lazy loading для изображений
- Сжатие изображений перед загрузкой

### 6. **Performance оптимизация**
- Включить кэширование для sitemap.xml (TTL: 1 час)
- Добавить gzip сжатие
- Минификация CSS/JS
- Preload критических ресурсов

### 7. **Analytics и отслеживание**
```tsx
// Добавить Google Analytics события
gtag('event', 'recipe_generated', {
  'recipe_name': recipeName,
  'user_id': userId
});

gtag('event', 'recipe_viewed', {
  'recipe_id': recipeId,
  'recipe_name': recipeName
});
```

### 8. **URL оптимизация**
- Использовать говорящие URL для категорий
- Добавить breadcrumbs навигацию
- Канонические ссылки для избежания дублей

### 9. **Content оптимизация**
- Добавить FAQ секцию на главную страницу
- Улучшить описания на странице генерации
- Добавить примеры удачных рецептов
- Улучшить инструкции по использованию

### 10. **Technical SEO**
```html
<!-- Добавить в layout.tsx -->
<link rel="canonical" href="https://foodsnapai.food" />
<link rel="alternate" hreflang="en" href="https://foodsnapai.food" />
<link rel="alternate" hreflang="ru" href="https://foodsnapai.food/ru" />

<!-- Preconnect к внешним ресурсам -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="//www.google-analytics.com" />
```

## 📊 KPI для отслеживания

1. **Organic Traffic** - рост органического трафика
2. **Recipe Views** - просмотры страниц рецептов
3. **Time on Site** - время проведенное на сайте  
4. **Bounce Rate** - показатель отказов
5. **Recipe Generation Rate** - конверсия в генерацию рецептов
6. **Search Console** - позиции в поиске Google

## 🛠 Инструменты для мониторинга

- Google Search Console - отслеживание позиций
- Google Analytics - трафик и поведение
- PageSpeed Insights - скорость загрузки
- Schema.org Validator - проверка структурированных данных
- Rich Results Test - тестирование расширенных результатов

## 📈 Roadmap

### Краткосрочно (1-2 недели)
- [x] Упростить sitemap.xml до существующих страниц
- [x] Настроить robots.txt 
- [x] Добавить structured data
- [ ] Добавить meta теги на все страницы
- [ ] Оптимизировать изображения

### Среднесрочно (1 месяц)
- [ ] Добавить поиск и фильтры на /posted
- [ ] Улучшить SEO контент на главной
- [ ] Настроить Google Analytics события
- [ ] Улучшить performance загрузки

### Долгосрочно (3 месяца)
- [ ] Расширенная аналитика пользователей
- [ ] A/B тесты для улучшения конверсии
- [ ] Создание дополнительных полезных страниц
- [ ] Система рекомендаций рецептов 