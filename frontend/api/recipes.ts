const API_BASE = 'http://localhost:8080';

export type Ingredient = {
  name: string;
  weight: number;
  unit: string;
};

export type Recipe = {
  id: number;
  title: string;
  image: string | null;
  prep_time: number;
  ingredients: Ingredient[];
};

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/recipes`);
  if (!res.ok) throw new Error(`Failed to fetch recipes: ${res.status}`);
  return res.json();
}

export async function fetchRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Failed to fetch recipe: ${res.status}`);
  }
  return res.json();
}
