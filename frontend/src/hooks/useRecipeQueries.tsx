import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { getRecipeBySlug, patchRecipe, deleteRecipe } from "@/services/generateService";
import { IRecipe, RecipePatchRequest } from "@/interfaces/recipe";

export const useRecipeQuery = (slug: string) => {
    return useQuery({
        queryKey: ["recipe", slug],
        queryFn: () => getRecipeBySlug(slug),
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!slug,
    });
};

export const useUpdateRecipeMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: RecipePatchRequest }) =>
            patchRecipe(id, data),
        
        onSuccess: () => {
            toast.success("Recipe updated successfully!");
            // Инвалидация всех связанных кешей
            invalidateRecipeQueries(queryClient);
        },
        
        onError: (error: Error) => {
            toast.error("Failed to update recipe. Error: " + error.message);
        },
    });
};

export const useUpdateRecipeNameMutation = (slug: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dish_name }: { id: number; dish_name: string }) =>
            patchRecipe(id, { dish_name }),
        
        onMutate: async ({ dish_name }) => {
            await queryClient.cancelQueries({ queryKey: ["recipe", slug] });
            
            const previousRecipe = queryClient.getQueryData(["recipe", slug]);
            
            queryClient.setQueryData(["recipe", slug], (old: IRecipe) => ({
                ...old,
                dish_name,
            }));
            
            return { previousRecipe };
        },
        
        onError: (err, variables, context) => {
            if (context?.previousRecipe) {
                queryClient.setQueryData(["recipe", slug], context.previousRecipe);
            }
            toast.error("Failed to update recipe name");
        },
        
        onSuccess: () => {
            toast.success("Recipe name updated successfully!");
        },
        
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["recipe", slug] });
            invalidateRecipeQueries(queryClient);
        },
    });
};

export const useToggleRecipePublishMutation = (slug: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_published }: { id: number; is_published: boolean }) =>
            patchRecipe(id, { publish: is_published }),
        
        onMutate: async ({ is_published }) => {
            await queryClient.cancelQueries({ queryKey: ["recipe", slug] });
            
            const previousRecipe = queryClient.getQueryData(["recipe", slug]);
            
            queryClient.setQueryData(["recipe", slug], (old: IRecipe) => ({
                ...old,
                is_published,
            }));
            
            return { previousRecipe };
        },
        
        onError: (err, variables, context) => {
            if (context?.previousRecipe) {
                queryClient.setQueryData(["recipe", slug], context.previousRecipe);
            }
            toast.error("Failed to update publish status");
        },
        
        onSuccess: (data, variables) => {
            const status = variables.is_published ? "published" : "unpublished";
            toast.success(`Recipe ${status} successfully!`);
        },
        
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["recipe", slug] });
            invalidateRecipeQueries(queryClient);
        },
    });
};

export const useDeleteRecipeMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    return useMutation({
        mutationFn: (id: number) => deleteRecipe(id),
        
        onSuccess: () => {
            toast.success("Recipe deleted successfully!");
            router.push("/profile");
            
            invalidateRecipeQueries(queryClient);
        },
        
        onError: (error: Error) => {
            toast.error("Failed to delete recipe: " + error.message);
        },
    });
};

const invalidateRecipeQueries = (queryClient: QueryClient, recipeId?: number) => {
    if (recipeId) {
        queryClient.invalidateQueries({ 
            queryKey: ["recipe"], 
            predicate: (query) => query.queryKey.includes(recipeId)
        });
    }
    
    queryClient.invalidateQueries({ queryKey: ["recipes"] });
    
    queryClient.invalidateQueries({ queryKey: ["user"] });
};