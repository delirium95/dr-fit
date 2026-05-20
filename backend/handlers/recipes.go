package handlers

import (
	"encoding/json"
	"os"
	"strconv"

	"dr-fit-hiring-test/backend/models"

	"github.com/gofiber/fiber/v2"
)

var recipes []models.Recipe

// LoadRecipes reads recipes.json and normalises every recipe's ingredients
// into []Ingredient regardless of whether the source data is an array or a string.
func LoadRecipes(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	var raw []models.RawRecipe
	if err := json.Unmarshal(data, &raw); err != nil {
		return err
	}

	recipes = make([]models.Recipe, len(raw))
	for i, r := range raw {
		recipes[i] = models.Recipe{
			ID:          r.ID,
			Title:       r.Title,
			Image:       r.Image,
			PrepTime:    r.PrepTime,
			Ingredients: parseIngredients(r.Ingredients),
		}
	}
	return nil
}

func ListRecipes(c *fiber.Ctx) error {
	return c.JSON(recipes)
}

func GetRecipe(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	for i := range recipes {
		if recipes[i].ID == id {
			return c.JSON(&recipes[i])
		}
	}

	// Bug #3 fix: return 404 instead of null + 200
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "recipe not found"})
}
