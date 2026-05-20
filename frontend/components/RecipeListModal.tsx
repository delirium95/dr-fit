import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { fetchRecipes, Recipe } from '../api/recipes';

const PLACEHOLDER = require('../assets/placeholder-recipe.jpg');

export function RecipeListModal() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes()
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipes</Text>
      <ScrollView style={styles.scroll}>
        {recipes.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={styles.card} activeOpacity={0.7}>
            <Image
              source={recipe.image ? { uri: recipe.image } : PLACEHOLDER}
              style={styles.image}
            />
            <View style={styles.cardBody}>
              <Text style={styles.title}>{recipe.title}</Text>
              <Text style={styles.prepTime}>Prep: {recipe.prep_time} min</Text>
              <View style={styles.ingredientsBlock}>
                <Text style={styles.ingredientsHeader}>Ingredients:</Text>
                {recipe.ingredients.map((ing, idx) => (
                  <Text key={idx} style={styles.ingredientLine}>
                    • {ing.name} — {ing.weight}{ing.unit}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#cc0000',
    padding: 20,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  scroll: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  cardBody: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  prepTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  ingredientsBlock: {
    marginTop: 4,
  },
  ingredientsHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  ingredientLine: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
});
