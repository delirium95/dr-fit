import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fetchRecipes, Recipe } from '../api/recipes';

const PLACEHOLDER = require('../assets/placeholder-recipe.jpg');

type Props = {
  onSelect: (recipe: Recipe) => void;
};

export function RecipeListScreen({ onSelect }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

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

  const filtered = useMemo(
    () =>
      recipes.filter((r) =>
        r.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [recipes, query],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={52} color={ACCENT} />
        <Text style={styles.errorTitle}>Couldn't load recipes</Text>
        <Text style={styles.errorSub}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Recipes</Text>
        <Text style={styles.headerCount}>{filtered.length}</Text>
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={MUTED} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes…"
          placeholderTextColor={MUTED}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => onSelect(item)} />}
        contentContainerStyle={filtered.length === 0 ? styles.listEmpty : styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={52} color="#D1D5DB" />
            <Text style={styles.emptyText}>No results for "{query}"</Text>
          </View>
        }
      />
    </View>
  );
}

// ─────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────

type CardProps = { recipe: Recipe; onPress: () => void };

function RecipeCard({ recipe, onPress }: CardProps) {
  const hasImage = !!recipe.image;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.72}>
      <Image
        source={hasImage ? { uri: recipe.image! } : PLACEHOLDER}
        style={styles.thumbnail}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.prepRow}>
          <Ionicons name="time-outline" size={13} color={MUTED} />
          <Text style={styles.prepText}>{recipe.prep_time} min</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={styles.chevron} />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────

const ACCENT = '#FF6B35';
const MUTED = '#9CA3AF';
const BG = '#FAFAF8';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: BG,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 4,
  },
  errorSub: {
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: 15,
    fontWeight: '500',
    color: MUTED,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 0, // Android alignment fix
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: MUTED,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  thumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F0F0',
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  prepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prepText: {
    fontSize: 13,
    color: MUTED,
  },
  chevron: {
    marginRight: 14,
  },
});
