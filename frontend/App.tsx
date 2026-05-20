import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Recipe } from './api/recipes';
import { RecipeListScreen } from './components/RecipeListScreen';
import { RecipeDetailScreen } from './components/RecipeDetailScreen';

type Screen =
  | { name: 'list' }
  | { name: 'detail'; recipe: Recipe };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'list' });

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      {screen.name === 'list' ? (
        <RecipeListScreen
          onSelect={(recipe) => setScreen({ name: 'detail', recipe })}
        />
      ) : (
        <RecipeDetailScreen
          recipe={screen.recipe}
          onBack={() => setScreen({ name: 'list' })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
});
