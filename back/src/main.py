from fastapi import FastAPI, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from src.database import engine, Base
from src.dependencies import get_db
from src.auth.router import router as auth_router
from src.gcs.router import router as gcs_router
from src.recipes.router import router as ai_router
from src.profile.router import router as profile_router
from src.admin.router import router as admin_router
from src.recipes.models import Recipe

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://20.215.248.3:3000/",
    "http://20.215.248.3:3000",
    "http://foodsnapai.food",
    "https://foodsnapai.food"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(gcs_router)
app.include_router(ai_router)
app.include_router(profile_router)
app.include_router(admin_router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Welcome to the FoodSnap AI!!"}


@app.get("/sitemap.xml", response_class=Response)
def sitemap(db: Session = Depends(get_db)):
    # Get current date for lastmod
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    # Get all published recipes
    published_recipes = db.query(Recipe).filter(Recipe.is_published == True).all()
    
    # Build recipe URLs dynamically
    recipe_urls = ""
    for recipe in published_recipes[:100]:  # Limit to 100 recipes for performance
        if recipe.slug:
            recipe_url = f"""    <url>
        <loc>https://foodsnapai.food/recipe/{recipe.slug}</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>"""
            
            # Add image if available
            if recipe.image_path:
                recipe_url += f"""
        <image:image>
            <image:loc>{recipe.image_path}</image:loc>
            <image:caption>{recipe.dish_name} - AI Generated Recipe</image:caption>
            <image:title>{recipe.dish_name}</image:title>
        </image:image>"""
            
            recipe_url += "\n    </url>\n"
            recipe_urls += recipe_url

    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

    <!-- Main Pages -->
    <url>
        <loc>https://foodsnapai.food/</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <url>
        <loc>https://foodsnapai.food/generate</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://foodsnapai.food/posted</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Authentication Pages -->
    <url>
        <loc>https://foodsnapai.food/signin</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    
    <url>
        <loc>https://foodsnapai.food/signup</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>

    <!-- Dynamic Recipe URLs -->
{recipe_urls}
</urlset>"""
    return Response(content=content, media_type="application/xml")


@app.get("/robots.txt", response_class=Response)
def robots_txt():
    content = """User-agent: *
Allow: /
Allow: /generate
Allow: /posted
Allow: /signin
Allow: /signup
Allow: /recipe/*

# Disallow admin and private pages
Disallow: /profile
Disallow: /settings
Disallow: /admin/
Disallow: /api/admin/
Disallow: /private/

# Disallow search parameters
Disallow: /*?*
Disallow: /*#*

# Disallow temporary files
Disallow: /*.tmp
Disallow: /*.temp
Disallow: /tmp/

# Allow crawling of sitemap
Sitemap: https://foodsnapai.food/sitemap.xml

# Special instructions for different bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

# Block aggressive crawlers
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Social media crawlers
# Social media crawlers
User-agent: facebookexternalhit
Allow: /
Allow: /recipe/*
Allow: /og-image.jpg

User-agent: Twitterbot
Allow: /
Allow: /recipe/*
Allow: /og-image.jpg

User-agent: LinkedInBot
Allow: /
Allow: /recipe/*
Allow: /og-image.jpg

User-agent: WhatsApp
Allow: /
Allow: /recipe/*
Allow: /og-image.jpg
"""
    return Response(content=content, media_type="text/plain")


@app.get("/structured-data.json", response_class=Response)
def structured_data(db: Session = Depends(get_db)):
    """Generate JSON-LD structured data for SEO"""
    
    # Get some featured recipes
    featured_recipes = db.query(Recipe).filter(Recipe.is_published == True).limit(10).all()
    
    # Build recipe structured data
    recipes_data = []
    for recipe in featured_recipes:
        if recipe.slug:
            recipe_data = {
                "@type": "Recipe",
                "name": recipe.dish_name,
                "description": f"AI-generated recipe for {recipe.dish_name}",
                "url": f"https://foodsnapai.food/recipe/{recipe.slug}",
                "author": {
                    "@type": "Person",
                    "name": recipe.user.username if recipe.user else "FoodSnap AI"
                },
                "datePublished": datetime.now().isoformat(),
                "recipeCategory": "AI Generated",
                "recipeCuisine": "Various",
                "keywords": f"{recipe.dish_name}, AI recipe, cooking",
                "nutrition": {
                    "@type": "NutritionInformation",
                    "calories": f"{recipe.total_calories_per_100g} per 100g" if recipe.total_calories_per_100g else "Calculated by AI"
                }
            }
            
            if recipe.image_path:
                recipe_data["image"] = recipe.image_path
                
            recipes_data.append(recipe_data)
    
    structured_data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://foodsnapai.food/#website",
                "url": "https://foodsnapai.food/",
                "name": "FoodSnap AI",
                "description": "AI-powered recipe generation from food photos. Upload your food images and get instant recipes with ingredients and cooking instructions.",
                "publisher": {
                    "@type": "Organization",
                    "name": "FoodSnap AI",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://foodsnapai.food/images/logo.png"
                    }
                }
            },
            {
                "@type": "Organization",
                "@id": "https://foodsnapai.food/#organization",
                "name": "FoodSnap AI",
                "url": "https://foodsnapai.food/",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://foodsnapai.food/images/logo.png",
                    "width": 60,
                    "height": 60
                },
                "description": "AI-powered recipe generation platform",
                "sameAs": [
                    "https://www.tiktok.com/@foodsnap_ai",
                    "https://www.instagram.com/foodsnap_ai/",
                    "https://x.com/FoodSnapAI",
                    "https://www.linkedin.com/in/maxim-sarsekeyev-a133ba354/"
                ]
            }
        ] + recipes_data
    }
    
    return Response(content=str(structured_data).replace("'", '"'), media_type="application/ld+json")


@app.get("/manifest.json", response_class=Response)
def web_manifest():
    """Generate PWA manifest for mobile installation"""
    manifest = {
        "name": "FoodSnap AI",
        "short_name": "FoodSnap",
        "description": "AI-powered recipe generation from food photos",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#f8f3ec",
        "theme_color": "#f48a3b",
        "orientation": "portrait-primary",
        "icons": [
            {
                "src": "/images/logo.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any maskable"
            },
            {
                "src": "/images/logo.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any maskable"
            }
        ],
        "categories": ["food", "cooking", "ai", "recipes"],
        "screenshots": [
            {
                "src": "/images/screenshot-mobile.png",
                "sizes": "540x720",
                "type": "image/png",
                "form_factor": "narrow"
            },
            {
                "src": "/images/screenshot-desktop.png",
                "sizes": "1280x720",
                "type": "image/png",
                "form_factor": "wide"
            }
        ]
    }
    
    return Response(content=str(manifest).replace("'", '"'), media_type="application/json")


