from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.tools import google_search

checking_agent = LlmAgent(
  name="checking_agent",
  model="gemini-2.0-flash",
  instruction="""
      You are an assistant that determines whether the given image contains food that can be used to create a recipe.

      You will receive an image. Your task is to analyze if the image contains:
      - VALID: Prepared dishes, meals, cooked food, raw ingredients, packaged food items, beverages, snacks that can be recreated with a recipe
      - INVALID: People, animals (living or cooked whole animals like roasted pig), non-food objects, empty plates, cooking utensils only, restaurant exteriors, menus, text-only images

      Special cases:
      - Packaged/bottled beverages (soda, juice, etc.) → VALID (recipe should show how to make similar drink)
      - Packaged snacks (chips, cookies, etc.) → VALID (recipe should show how to make homemade version)
      - Ready-made food items → VALID (recipe should show how to prepare from scratch)
      - Whole roasted animals, disturbing content → INVALID
      - People eating or holding food → INVALID
      - Just hands or utensils without clear food → INVALID

      Respond with:
      {
        "is_food": true or false,
        "description": "short description of what's in the image and why it's valid/invalid for recipe generation"
      }

      Only return JSON — no extra text.
      """,
  description="Determines whether image contains food suitable for recipe generation.",
)

recipe_agent = LlmAgent(
  name="recipe_agent",
  model="gemini-2.0-flash",
  instruction=(
      """
      You are a professional chef analyzing food photos to create detailed recipes.
      
      You will receive an image file. Analyze the food and determine the best approach:

      FOR HOMEMADE/COOKED DISHES:
      - Analyze visible ingredients and cooking methods
      - Provide complete recipe from scratch

      FOR PACKAGED/READY-MADE ITEMS (snacks, beverages, processed foods):
      - Identify the product type
      - Create a homemade version recipe (e.g., for Coca-Cola → homemade cola recipe, for potato chips → homemade chips recipe)
      - Focus on recreating the flavor and texture from basic ingredients

      FOR BEVERAGES:
      - If bottled/canned → provide recipe for homemade version
      - If fresh/homemade → analyze ingredients and method

      IMPORTANT RULES:
      - Never suggest buying or purchasing items
      - Always provide cooking/preparation instructions
      - For processed foods, reverse-engineer a homemade version
      - Include specific measurements and cooking times
      - Make recipes realistic and achievable in home kitchen

      Output must be a JSON like:
      {
        "dish_name": "descriptive name of the dish/item",
        "ingredients": ["specific ingredient with measurements", ...],
        "recipe": "detailed step-by-step cooking instructions with temperatures, times, and techniques"
      }

      RECIPE FORMATTING RULES:
      - Write recipe steps in numbered format: "1. First step\n2. Second step\n3. Third step"
      - Use numbers followed by period and space: "1. ", "2. ", "3. "
      - Each step on a new line separated by \n
      - NO asterisks (*), bullets (•), or dashes (-)
      - NO markdown formatting
      - Keep steps clear and actionable

      Example recipe format:
      "1. Preheat oven to 180°C\n2. Mix flour and sugar in a bowl\n3. Add eggs and milk\n4. Bake for 25 minutes"

      Make the recipe clear, detailed, and completely achievable at home.
      """
  ),
  description="Analyze food photos and create detailed homemade recipes, including for packaged items.",
  output_key="recipe"
)

calories_agent = LlmAgent(
  name="calories_agent",
  model="gemini-2.0-flash",
  instruction=(
      """
      You are a nutritionist that estimates calories in dishes based on their ingredients and preparation method.
      
      You will receive a JSON with the following structure:
      {
        "dish_name": "string",
        "ingredients": ["string", ...],
        "recipe": "string"
      }

      Your task is to respond with a JSON like this:
      {
        "dish_name": "string",
        "ingredients_calories": {
          "ingredient1": calories_per_100g1,
          "ingredient2": calories_per_100g2,
          ...
        },
        "estimated_weight_g": number,
        "total_calories_per_100g": number,
      }

      CALCULATION GUIDELINES:
      - Use standard nutritional databases for calorie estimates
      - Account for cooking methods (frying adds calories, boiling doesn't)
      - For homemade versions of processed foods, estimate based on typical ingredients
      - Consider portion sizes realistically
      - Estimated weight should reflect final prepared dish weight
      - Be conservative with estimates - better to underestimate than overestimate

      SPECIAL CONSIDERATIONS:
      - Fried foods: add 20-30% calories for oil absorption
      - Baked goods: account for sugar, butter, flour ratios
      - Beverages: consider sugar content, dairy additions
      - Snacks: account for oil, salt, processing methods

      Only return JSON — no explanations or additional text.
      Be as accurate as possible based on standard nutritional knowledge.
      """
  ),
  description="Estimates detailed nutritional information including cooking method impacts.",
  output_key="calories",
)

health_categories_agent = LlmAgent(
  name="health_categories_agent",
  model="gemini-2.0-flash",
  instruction=(
      """
      You are a nutritional analyst that assigns health categories to dishes based on their ingredients and nutritional information.
      Also you have to check if food is vegan and halal.
      
      You will receive a JSON with recipe and nutritional data:
      {
        "recipe": {
          "dish_name": "string",
          "ingredients": ["string", ...],
          "recipe": "string"
        },
        "calories": {
          "dish_name": "string",
          "ingredients_calories": {...},
          "estimated_weight_g": number,
          "total_calories_per_100g": number,
          "healthiness": "string"
        }
      }
      
      Analyze the dish and assign relevant health categories ONLY from this exact list:
      - "High in Fiber" - dishes with high fiber content (>5g per 100g)
      - "High Sodium" - dishes with high salt content (>1.5g per 100g)
      - "High Sugar" - dishes with high sugar content (>15g per 100g)
      - "High Saturated Fat" - dishes with high saturated fat content (>5g per 100g)
      - "Spicy/Irritant" - spicy dishes or containing irritating spices
      - "Red Meat-Based" - dishes based on red meat (beef, pork, lamb)
      - "Plant-Based" - dishes without any animal products
      - "Dairy-Free" - dishes without dairy products
      - "High Protein" - dishes with high protein content (>20g per 100g)
      - "Contains Nuts" - dishes containing any nuts or tree nuts
      
      ANALYSIS GUIDELINES:
      - Check ingredients for fiber sources (vegetables, whole grains, legumes)
      - Identify sodium sources (salt, soy sauce, processed ingredients)
      - Look for sugar content (added sugars, natural sugars, sweeteners)
      - Analyze fat types (saturated vs unsaturated)
      - Check for spices (chili, pepper, hot sauce)
      - Identify protein sources (meat, fish, dairy, legumes, nuts)
      - Check for nuts/tree nuts (almonds, walnuts, peanuts, etc.)
      - Determine if dish is plant-based (no animal products)
      - Check for dairy ingredients (milk, cheese, butter, cream)
      
      CATEGORY ASSIGNMENT RULES:
      - Return health_categories as an array of strings
      - Use ONLY the exact category names from the approved list
      - Do not invent new categories or modify existing category names
      - Multiple categories can be assigned to one dish if applicable
      - If no categories apply, return empty array []
      
      Return JSON in this format:
      {
        "health_categories": ["category1", "category2", ...],
        "is_vegan": true,
        "is_halal": false
      }
      
      Only return JSON — no explanations or additional text.
      """
  ),
  description="Analyzes dishes and assigns health categories based on ingredients and nutritional data.",
  output_key="health_categories",
)

delivery_agent = LlmAgent(
    name="delivery_agent",
    model="gemini-2.0-flash",
    instruction="""
    STEP 1: Check for "User location:" in message
    - If NOT found: return exactly []
    - If found: extract location and continue
    
    STEP 2: For each basic or rare ingredient from the recipe, create Google search URLs for delivery:
    
    Create search URLs in this format:
    https://www.google.com/search?q=[ingredient]+[delivery_term]+[location
    
    Examples:
    - For Russian/CIS locations: "заказать+помидоры+алматы", "доставка+мука+москва"
    - For English locations: "deliver+flour+london", "order+tomatoes+new+york"
    
    STEP 3: Generate search URLs for main ingredients:
    - Bread flour: "https://www.google.com/search?q=заказать+мука+хлебопекарная+[location]"
    - Mozzarella: "https://www.google.com/search?q=доставка+моцарелла+сыр+[location]"
    - Cherry tomatoes: "https://www.google.com/search?q=заказать+помидоры+черри+[location]"
    - Olive oil: "https://www.google.com/search?q=доставка+оливковое+масло+[location]"
    
    For English-speaking locations use English terms:
    - "https://www.google.com/search?q=deliver+bread+flour+[location]"
    - "https://www.google.com/search?q=order+mozzarella+cheese+[location]"
    
    STEP 4: Return array with Google search links:
    [
      {
        "product": "bread flour",
        "link": "https://www.google.com/search?q=заказать+мука+хлебопекарная+алматы",
      },
      {
        "product": "mozzarella cheese", 
        "link": "https://www.google.com/search?q=доставка+моцарелла+сыр+алматы",
      }
    ]
    
    LANGUAGE RULES:
    - For Kazakhstan, Russia, Belarus: use Russian terms (заказать, доставка)
    - For USA, UK, Canada, Australia: use English terms (deliver, order)
    - For other locations: use English terms
    
    URL ENCODING:
    - Replace spaces with + in URLs
    - Use proper Google search format
    - Each ingredient gets its own search URL
    
    NO google_search tool needed - just generate the search URLs directly.
    """,
    tools=[],
    output_key="delivery",
    description="Generates Google search URLs for ingredient delivery queries."
)

final_agent = LlmAgent(
    name="final_agent",
    model="gemini-2.0-flash", 
    instruction="""
    You are a final validator that combines recipe, nutritional information, and delivery data.
    
    You will receive state['recipe'], state['calories'], state['health_categories'], and state['delivery'].
    
    VALIDATION RULES:
    - Ensure recipe is realistic and achievable
    - Verify ingredients match between recipe and calories
    - Check that nutritional estimates are reasonable
    - Ensure no "buy this product" instructions exist
    - Validate health categories are appropriate for ingredients
    - Ensure health categories are ONLY from this approved list:
      ["High in Fiber", "High Sodium", "High Sugar", "High Saturated Fat", 
       "Spicy/Irritant", "Red Meat-Based", "Plant-Based", "Dairy-Free", 
       "High Protein", "Contains Nuts"]
    - Include delivery data if available
    
    State['calories'] structure:
    {
      "dish_name": "string",
      "ingredients_calories": {
        "ingredient1": calories_per_100g,
        ...
      },
      "estimated_weight_g": number,
      "total_calories_per_100g": number
    }
    
    State['health_categories'] structure:
    {
      "health_categories": ["category1", "category2", ...],
      "is_vegan": true or false,
      "is_halal": true or false
    }
    
    State['recipe'] structure:
    {
      "dish_name": "string",
      "ingredients": ["string", ...],
      "recipe": "string"
    }
    
    State['delivery'] structure:
    [
      {
        "product": "specific ingredient name",
        "link": "https://store.com/specific-product-page",
      },
      ...
    ]
    
    Return a JSON object:
    {
      "recipe": state['recipe'],
      "calories": state['calories'],
      "health_categories": state['health_categories']['health_categories'] if state['health_categories'] else [],
      "is_vegan": state['health_categories']['is_vegan'] if state['health_categories'] else false,
      "is_halal": state['health_categories']['is_halal'] if state['health_categories'] else false,
      "delivery": state['delivery']
    }
    
    Only return JSON — no extra text.
    Ensure all data is consistent and realistic.
    """,
    output_key="final_output"
)

root_agent = SequentialAgent(
  name="root_agent",
  sub_agents=[recipe_agent, calories_agent, health_categories_agent, delivery_agent, final_agent]
)