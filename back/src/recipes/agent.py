from google.adk.agents import Agent

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