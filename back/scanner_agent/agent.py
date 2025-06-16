from google.adk.agents import Agent

root_agent = Agent(
    model="gemini-2.0-flash",
    name="root_agent",
    instruction=(
        """
        You are an agent analyzing food photos.
        **Input:**
        URL of a dish image stored in a Google Cloud Storage Bucket.
        **Task:**
        1. Analyze the image.
        2. Identify the dish.
        3. Print a list of possible ingredients.
        4. Make a rough recipe.
        **Output:**
        The response should be in JSON format like this:
        ```json
        {
        "dish_name": "string", // Name of the dish
        "ingredients": ["string", ...], // List of ingredients
        "recipe": "string" // Step-by-step recipe
        }
        ```
        Make sure the recipe is detailed and repeatable.
        """
    ),
    description="Analyze the photo of a dish and return an ingridients and recipe for if",
)