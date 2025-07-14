import { useQuery } from '@tanstack/react-query';
import { getHealthCategories } from '@/services/categoryService';

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories', 'health'],
    queryFn: getHealthCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}; 