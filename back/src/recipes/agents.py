from google.adk.agents import LlmAgent, SequentialAgent

checking_agent = LlmAgent(
  name="checking_agent",
  model="gemini-2.0-flash",
  instruction="""
      You are an assistant that determines whether the given image contains food.

      You will receive an image. Your task is to respond with:
      {
        "is_food": true or false,
        "description": "short description of what's in the image"
      }

      Only return JSON — no extra text.
      """,
  description="Determines whether image contains food.",
)

recipe_agent = LlmAgent(
  name="recipe_agent",
  model="gemini-2.0-flash",
  instruction=(
      """
      You are an agent analyzing food photos.
      You will receive an image file. Visually analyze the image and return:
      1. Name of the dish.
      2. List of ingredients.
      3. Step-by-step recipe.
      Output must be a JSON like:
      {
        "dish_name": "string",
        "ingredients": ["string", ...],
        "recipe": "string"
      }
      Make the recipe clear and repeatable.
      """
  ),
  description="Analyze the dish photo and generate recipe.",
  output_key="recipe"
)

calories_agent = LlmAgent(
  name="calories_agent",
  model="gemini-2.0-flash",
  instruction=(
      """
      You are an agent that estimates the calories in a dish based on its ingredients and recipe.
      
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

      - Estimate calories per 100 grams for each ingredient based on standard nutritional data.
      - Estimate approximate final weight of the dish in grams.
      - Calculate total_calories_per_100g for the entire dish.
      - Only return JSON — no explanations or additional text.
      - Be as accurate as possible based on common nutritional knowledge.
      """
  ),
  description="Estimates per-ingredient and total calories per 100g, and estimates weight.",
  output_key="calories",
)


final_agent = LlmAgent(
    name="final_agent",
    model="gemini-2.0-flash", 
    instruction="""
    You will receive state['recipe'] and state['calories'].
    State['calories'] is a JSON object with the following structure:
    {
      "dish_name": "string",
      "ingredients_calories": {
        "ingredient1": calories_per_100g,
        ...
      },
      "estimated_weight_g": number,
      "total_calories_per_100g": number,
    } and state['recipe'] is a JSON object with the following structure:
    {
      "dish_name": "string",
      "ingredients": ["string", ...],
      "recipe": "string"
    }
    Return a JSON object:
    {
      "recipe": state['recipe'],
      "calories": state['calories']
    }
    Only return JSON — no extra text.
    """,
    output_key="final_output"
)

root_agent = SequentialAgent(
  name="root_agent",
  sub_agents=[recipe_agent, calories_agent, final_agent]
)