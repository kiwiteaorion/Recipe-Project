class RecipeApp {
  constructor() {
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    this.searchInput = document.getElementById("searchInput");
    this.searchButton = document.getElementById("searchButton");
    this.recipesContainer = document.getElementById("recipesContainer");
    this.cuisineFilter = document.getElementById("cuisineFilter");
    this.loading = document.getElementById("loading");
    this.modal = document.getElementById("recipeModal");
    this.modalClose = document.querySelector(".close");
    this.recipeDetails = document.getElementById("recipeDetails");
  }

  setupEventListeners() {
    this.searchButton.addEventListener("click", () => this.handleSearch());
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });
    this.cuisineFilter.addEventListener("change", () => this.handleSearch());
    this.modalClose.addEventListener("click", () => this.closeModal());
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  showLoading() {
    this.loading.style.display = "flex";
  }

  hideLoading() {
    this.loading.style.display = "none";
  }

  async handleSearch() {
    const query = this.searchInput.value.trim();
    const cuisine = this.cuisineFilter.value;

    if (!query) return;

    this.showLoading();
    try {
      const recipes = await RecipeAPI.searchRecipes(query, cuisine);
      this.displayRecipes(recipes);
    } catch (error) {
      alert("Error searching recipes. Please try again.");
    }
    this.hideLoading();
  }

  displayRecipes(recipes) {
    this.recipesContainer.innerHTML = recipes
      .map(
        (recipe) => `
            <div class="recipe-card" onclick="app.showRecipeDetails(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            </div>
        `
      )
      .join("");
  }

  async showRecipeDetails(recipeId) {
    this.showLoading();
    try {
      const recipe = await RecipeAPI.getRecipeDetails(recipeId);
      this.recipeDetails.innerHTML = `
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}">
                <div class="recipe-info">
                    <p>Ready in: ${recipe.readyInMinutes} minutes</p>
                    <p>Servings: ${recipe.servings}</p>
                </div>
                <h3>Ingredients:</h3>
                <ul>
                    ${recipe.extendedIngredients
                      .map((ingredient) => `<li>${ingredient.original}</li>`)
                      .join("")}
                </ul>
                <h3>Instructions:</h3>
                <ol>
                    ${
                      recipe.instructions
                        ? recipe.analyzedInstructions[0]?.steps
                            .map((step) => `<li>${step.step}</li>`)
                            .join("")
                        : "No instructions available."
                    }
                </ol>
            `;
      this.modal.style.display = "block";
    } catch (error) {
      alert("Error fetching recipe details. Please try again.");
    }
    this.hideLoading();
  }

  closeModal() {
    this.modal.style.display = "none";
  }
}

// Initialize the app
const app = new RecipeApp();
