package handlers

import (
	"encoding/json"
	"regexp"
	"strconv"
	"strings"

	"dr-fit-hiring-test/backend/models"
)

// knownUnits is the set of measurement words we recognise as a unit token.
var knownUnits = map[string]bool{
	"g": true, "kg": true, "ml": true, "l": true,
	"oz": true, "lb": true, "lbs": true,
	"cup": true, "cups": true,
	"tbsp": true, "tsp": true,
	"slice": true, "slices": true,
	"piece": true, "pieces": true,
	"clove": true, "cloves": true,
	"handful": true, "handfuls": true,
	"pinch": true, "pinches": true,
}

// reNumUnitName matches "2 slices sourdough" → [_, "2", "slices", "sourdough"]
var reNumUnitName = regexp.MustCompile(`^(\d+(?:\.\d+)?)\s+([a-zA-Z]+)\s+(.+)$`)

// reNumName matches "1 avocado" → [_, "1", "avocado"]
var reNumName = regexp.MustCompile(`^(\d+(?:\.\d+)?)\s+(.+)$`)

// parseIngredients normalises a raw JSON ingredients value (array or string) into
// a slice of Ingredient. It never returns nil — worst case it returns an empty slice.
func parseIngredients(raw json.RawMessage) []models.Ingredient {
	// Try structured array first.
	var arr []models.Ingredient
	if err := json.Unmarshal(raw, &arr); err == nil {
		return arr
	}

	// Fall back to plain string.
	var s string
	if err := json.Unmarshal(raw, &s); err != nil || strings.TrimSpace(s) == "" {
		return []models.Ingredient{}
	}
	return parseIngredientString(s)
}

// parseIngredientString splits a comma-separated ingredient string and parses each item.
func parseIngredientString(s string) []models.Ingredient {
	parts := strings.Split(s, ",")
	result := make([]models.Ingredient, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			result = append(result, parseIngredientItem(p))
		}
	}
	return result
}

// parseIngredientItem tries three patterns in order:
//  1. "<number> <unit> <name>"  — e.g. "2 slices sourdough"
//  2. "<number> <name>"         — e.g. "1 avocado"
//  3. "<name>"                  — e.g. "salt", "chili flakes"
func parseIngredientItem(s string) models.Ingredient {
	if m := reNumUnitName.FindStringSubmatch(s); m != nil {
		unit := m[2]
		if knownUnits[strings.ToLower(unit)] {
			w, _ := strconv.ParseFloat(m[1], 64)
			return models.Ingredient{Name: m[3], Weight: w, Unit: unit}
		}
		// The middle word is not a unit — treat number+word+rest as "<number> <name>".
		w, _ := strconv.ParseFloat(m[1], 64)
		return models.Ingredient{Name: m[2] + " " + m[3], Weight: w, Unit: "piece"}
	}

	if m := reNumName.FindStringSubmatch(s); m != nil {
		w, _ := strconv.ParseFloat(m[1], 64)
		return models.Ingredient{Name: m[2], Weight: w, Unit: "piece"}
	}

	return models.Ingredient{Name: s, Weight: 0, Unit: ""}
}
