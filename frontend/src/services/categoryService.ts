import axios from '@/lib/axios';

export async function getHealthCategories(): Promise<string[]> {
  const response = await axios.get('/dish/categories/health/');
  return response.data;
} 