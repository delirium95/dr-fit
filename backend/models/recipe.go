package models

import "encoding/json"

type Ingredient struct {
	Name   string  `json:"name"`
	Weight float64 `json:"weight"`
	Unit   string  `json:"unit"`
}

type Recipe struct {
	ID          int          `json:"id"`
	Title       string       `json:"title"`
	Image       *string      `json:"image"`
	PrepTime    int          `json:"prep_time"`
	Ingredients []Ingredient `json:"ingredients"`
}

// RawRecipe is used only during JSON loading — ingredients can be an array or a plain string.
type RawRecipe struct {
	ID          int             `json:"id"`
	Title       string          `json:"title"`
	Image       *string         `json:"image"`
	PrepTime    int             `json:"prep_time"`
	Ingredients json.RawMessage `json:"ingredients"`
}
