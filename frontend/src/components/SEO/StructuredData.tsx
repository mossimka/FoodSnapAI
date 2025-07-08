'use client';

import { usePathname } from 'next/navigation';

interface StructuredDataProps {
  type?: 'website' | 'recipe' | 'article';
  data?: any;
}

export function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const pathname = usePathname();
  
  const getStructuredData = () => {
    const baseUrl = 'https://foodsnapai.food';
    const currentUrl = `${baseUrl}${pathname}`;
    
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'FoodSnap AI',
          description: 'AI-powered app to recognize food and generate recipes',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
          sameAs: [
            'https://twitter.com/FoodSnapAI',
            'https://facebook.com/FoodSnapAI',
            'https://instagram.com/FoodSnapAI'
          ],
        };
      
      case 'recipe':
        if (!data) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: data.name,
          description: data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author,
          },
          datePublished: data.datePublished,
          recipeIngredient: data.ingredients,
          recipeInstructions: data.instructions?.map((instruction: string, index: number) => ({
            '@type': 'HowToStep',
            text: instruction,
            position: index + 1,
          })),
          nutrition: data.nutrition && {
            '@type': 'NutritionInformation',
            calories: data.nutrition.calories,
          },
          aggregateRating: data.rating && {
            '@type': 'AggregateRating',
            ratingValue: data.rating.value,
            ratingCount: data.rating.count,
          },
        };
      
      case 'article':
        if (!data) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'FoodSnap AI',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          url: currentUrl,
        };
      
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();
  
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
} 