class RecipeAPI {
  static async searchRecipes(query, cuisine = "") {
    try {
      const params = new URLSearchParams({
        apiKey: CONFIG.API_KEY,
        query: query,
        number: CONFIG.DEFAULT_LIMIT,
        cuisine: cuisine,
      });

      const response = await fetch(
        `${CONFIG.BASE_URL}/complexSearch?${params}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  }

  static async getRecipeDetails(recipeId) {
    try {
      const params = new URLSearchParams({
        apiKey: CONFIG.API_KEY,
      });

      const response = await fetch(
        `${CONFIG.BASE_URL}/${recipeId}/information?${params}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      throw error;
    }
  }
}
