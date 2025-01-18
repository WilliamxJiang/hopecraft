import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_hopecore_text(user_prompt):
    # Define the system prompt for uplifting messages in Hopecore style
    system_prompt = "You are an uplifting script generator in a Hopecore style. Please provide a short, comforting message that is exactly 50 words. If the user is feeling sad about mental health, include a self-help resource or helpline in Canada."

    user_message = f"User is sad about: {user_prompt}. Generate a short, comforting message in Hopecore style."

    try:
        # Make request to OpenAI API with max_tokens set to limit the response length
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.7,
            max_tokens=90,  # Approximate 50 words (tokens roughly equal 2 words)
        )

        # Get the response text
        generated_text = response['choices'][0]['message']['content'].strip()

        # Ensure the response is exactly 50 words
        words = generated_text.split()

        if len(words) == 50:
            return generated_text
        else:
            # Retry if the response is not exactly 50 words
            return generate_hopecore_text(user_prompt)

    except Exception as e:
        print(f"Error in GPT: {e}")
        return "Something went wrong, please try again later."


# Self-help helplines in Canada (can be expanded as needed)
def get_helplines_for_sadness(prompt):
    # Check if the prompt is related to mental health (you can expand this list)
    mental_health_keywords = ["sad", "anxiety", "depression", "stress", "overwhelmed", "mental health"]

    # If the user's prompt contains these keywords, return helplines for Canada
    if any(keyword in prompt.lower() for keyword in mental_health_keywords):
        helplines = """
        If you're feeling down or struggling with your mental health, here are some helplines:

        - Kids Help Phone: Call 1-800-668-6868 (Canada-wide, for youth under 20)
        - Crisis Services Canada: Call 1-833-456-4566 (24/7)
        - Canadian Mental Health Association: Visit https://cmha.ca/
        - Text 686868 to speak with a trained volunteer for immediate help.
        """
        return helplines
    else:
        return ""

# Example usage
if __name__ == "__main__":
    user_prompt = input("Enter what you're feeling sad about: ")

    # Generate the comforting message
    hopecore_message = generate_hopecore_text(user_prompt)

    # Include the helplines if the prompt suggests mental health concerns
    helplines = get_helplines_for_sadness(user_prompt)

    print("\nGenerated Hopecore Message: ")
    print(hopecore_message)

    # Print helplines if applicable
    if helplines:
        print("\nSelf-help Resources and Helplines:\n", helplines)

