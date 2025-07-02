export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  profile_pic?: string;
}

export interface AdminRecipe {
  id: number;
  slug: string;
  user_id: number;
  dish_name: string;
  is_published: boolean;
  username: string;
}

export interface AdminStats {
  total_users: number;
  total_admins: number;
  total_recipes: number;
  published_recipes: number;
}
