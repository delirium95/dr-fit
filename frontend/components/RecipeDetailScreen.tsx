import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Ingredient, Recipe } from '../api/recipes';

const PLACEHOLDER = require('../assets/placeholder-recipe.jpg');

type Props = {
  recipe: Recipe;
  onBack: () => void;
};

export function RecipeDetailScreen({ recipe, onBack }: Props) {
  const hasImage = !!recipe.image;
  const structuredIngredients = Array.isArray(recipe.ingredients)
    ? (recipe.ingredients as Ingredient[])
    : null;
  const freeTextIngredients = structuredIngredients ? null : (recipe.ingredients as string);

  return (
    <View style={styles.container}>
      {/* ── Hero ── */}
      <View style={styles.heroWrapper}>
        <Image
          source={hasImage ? { uri: recipe.image! } : PLACEHOLDER}
          style={styles.hero}
          resizeMode="cover"
        />
        {/* Gradient-like dark overlay at bottom of image for label readability */}
        <View style={styles.heroOverlay} />

        {/* Back button — floating over image */}
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Prep time pill */}
        <View style={styles.metaRow}>
          <View style={styles.pill}>
            <Ionicons name="time-outline" size={14} color={ACCENT} />
            <Text style={styles.pillText}>{recipe.prep_time} min prep</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Ingredients section */}
        <Text style={styles.sectionTitle}>Ingredients</Text>

        {structuredIngredients ? (
          <View style={styles.ingredientList}>
            {structuredIngredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <View style={styles.dot} />
                <Text style={styles.ingredientName}>{ing.name}</Text>
                {(ing.weight > 0 || !!ing.unit) && (
                  <Text style={styles.ingredientAmount}>
                    {ing.weight > 0 ? `${ing.weight} ` : ''}{ing.unit}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.ingredientFreeText}>{freeTextIngredients}</Text>
        )}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────

const ACCENT = '#FF6B35';
const BG = '#FAFAF8';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Hero
  heroWrapper: {
    position: 'relative',
    height: 280,
    backgroundColor: '#E5E7EB',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    // subtle gradient approximation via semi-transparent bottom stripe
    borderBottomWidth: 1,
    borderColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 16 : 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },

  // Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    lineHeight: 32,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF1EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },

  // Structured ingredients
  ingredientList: {
    gap: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: ACCENT,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  ingredientAmount: {
    fontSize: 14,
    color: '#6B7280',
    fontVariant: ['tabular-nums'],
  },

  // Free-text ingredients
  ingredientFreeText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
});
