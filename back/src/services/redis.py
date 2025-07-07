import redis.asyncio as redis
import os

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=int(os.getenv("REDIS_DB", 0)),
    decode_responses=True
)

async def invalidate_recipe_caches(recipe_slug: str | None = None):
    """Helper function to invalidate recipe-related caches"""
    try:
        # Invalidate specific recipe cache if slug provided
        if recipe_slug:
            await redis_client.delete(f"recipe:slug={recipe_slug}")
        
        # Invalidate paginated recipes caches
        cache_patterns = ["recipes:*", "recipes:public:*", "recipes:my:*"]
        for pattern in cache_patterns:
            keys = []
            cursor = 0
            while True:
                cursor, partial_keys = await redis_client.scan(cursor=cursor, match=pattern)
                keys.extend(partial_keys)
                if cursor == 0:
                    break
            
            if keys:
                await redis_client.delete(*keys)
    except Exception as e:
        print(f"Cache invalidation error: {e}")

async def invalidate_user_caches(user_id: int | None = None):
    """Helper function to invalidate user-related caches"""
    try:
        # Invalidate user-specific caches
        if user_id:
            cache_patterns = [f"recipes:my:user_id={user_id}:*"]
            for pattern in cache_patterns:
                keys = []
                cursor = 0
                while True:
                    cursor, partial_keys = await redis_client.scan(cursor=cursor, match=pattern)
                    keys.extend(partial_keys)
                    if cursor == 0:
                        break
                
                if keys:
                    await redis_client.delete(*keys)
    except Exception as e:
        print(f"User cache invalidation error: {e}")

async def invalidate_favorite_caches(user_id: int | None = None):
    """Helper function to invalidate favorite-related caches"""
    try:
        if user_id:
            cache_patterns = [f"favorites:user_id={user_id}:*"]
            for pattern in cache_patterns:
                keys = []
                cursor = 0
                while True:
                    cursor, partial_keys = await redis_client.scan(cursor=cursor, match=pattern)
                    keys.extend(partial_keys)
                    if cursor == 0:
                        break
                
                if keys:
                    await redis_client.delete(*keys)
    except Exception as e:
        print(f"Favorite cache invalidation error: {e}")