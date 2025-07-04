# Meta Tags Testing Guide

## Проблема
Социальные сети кэшируют метатеги на 30 дней. Даже после исправления кода, старые метатеги могут отображаться при шаринге.

## Тестирование метатегов

### 1. Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- Вставьте URL страницы
- Нажмите "Debug"
- Если показывает старые данные, нажмите "Scrape Again" несколько раз

### 2. Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- Вставьте URL страницы
- Нажмите "Preview card"

### 3. LinkedIn Post Inspector
- URL: https://www.linkedin.com/post-inspector/
- Вставьте URL страницы
- Нажмите "Inspect"

## Страницы для тестирования

### ✅ Главная страница
- URL: https://foodsnapai.food/
- Метатеги: ✅ Добавлены в `page.tsx`

### ✅ Генерация рецептов
- URL: https://foodsnapai.food/generate
- Метатеги: ✅ Добавлены в `generate/page.tsx`

### ✅ Сообщество рецептов
- URL: https://foodsnapai.food/posted
- Метатеги: ✅ Добавлены в `posted/layout.tsx`

### ✅ Страницы рецептов (динамические)
- URL: https://foodsnapai.food/recipe/[slug]
- Метатеги: ✅ Динамические в `recipe/[slug]/page.tsx`

### ❌ Страницы авторизации
- URL: https://foodsnapai.food/signin
- URL: https://foodsnapai.food/signup
- Метатеги: ❌ Не добавлены (низкий приоритет)

## Проверка метатегов в коде

### Проверить исходный код страницы:
1. Откройте страницу в браузере
2. Нажмите Ctrl+U (или Cmd+U на Mac)
3. Найдите теги `<meta property="og:*">`
4. Убедитесь, что все URL абсолютные (начинаются с https://foodsnapai.food)

### Ожидаемые метатеги:
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://foodsnapai.food/og-image.jpg">
<meta property="og:url" content="https://foodsnapai.food/...">
<meta property="og:site_name" content="FoodSnap AI">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://foodsnapai.food/og-image.jpg">
```

## Исправленные проблемы

### ✅ Относительные пути изображений
**Было:** `"/og-image.jpg"`
**Стало:** `"https://foodsnapai.food/og-image.jpg"`

### ✅ Смешанные URL в метатегах
**Было:** OpenGraph: `localhost:3000`, Twitter: `production`
**Стало:** Все URL абсолютные с production доменом

### ✅ Динамические метатеги для рецептов
**Добавлено:** `generateMetadata()` функция для уникальных метатегов каждого рецепта

## Следующие шаги

1. **Протестировать все страницы** в Facebook Debugger
2. **Очистить кэш** нажатием "Scrape Again"
3. **Проверить отображение** при шаринге в соцсетях
4. **Добавить метатеги** для страниц авторизации (опционально)

## Полезные ссылки

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Open Graph Protocol](https://ogp.me/) 