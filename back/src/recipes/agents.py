from google.adk.agents import Agent

checking_agent = Agent(
  model="gemini-2.0-flash",
  name="checking_agent",
  instruction="""
      You are an assistant that determines whether the given image contains food.

      You will receive an image. Your task is to respond with:
      {
        "is_food": true or false,
        "description": "short description of what’s in the image"
      }

      Only return JSON — no extra text.
      """,
  description="Determines whether image contains food.",
)

root_agent = Agent(
  model="gemini-2.0-flash",
  name="root_agent",
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
)