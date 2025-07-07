import axios from 'axios';

export interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  categories?: string;
  ingredients_text?: string;
  ingredients_text_en?: string;
  image_url?: string;
  image_front_url?: string;
  nutriments?: {
    energy_100g?: number;
    energy_unit?: string;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
  };
  nutrition_grades?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  countries?: string;
  stores?: string;
}

export interface OpenFoodFactsResponse {
  code: string;
  product?: OpenFoodFactsProduct;
  status: number;
  status_verbose: string;
}

const OPEN_FOOD_FACTS_API_BASE = 'https://world.openfoodfacts.org/api/v0';

export const openFoodFactsService = {
  async getProductByBarcode(barcode: string): Promise<OpenFoodFactsResponse> {
    try {
      const response = await axios.get(`${OPEN_FOOD_FACTS_API_BASE}/product/${barcode}.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product from Open Food Facts:', error);
      throw new Error('Failed to fetch product information');
    }
  },

  async searchProducts(query: string, page: number = 1, pageSize: number = 20) {
    try {
      const response = await axios.get(`${OPEN_FOOD_FACTS_API_BASE}/cgi/search.pl`, {
        params: {
          search_terms: query,
          page,
          page_size: pageSize,
          json: 1,
          sort_by: 'unique_scans_n',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products from Open Food Facts:', error);
      throw new Error('Failed to search products');
    }
  }
}; 