import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useApp } from "@/src/contexts/AppContext";
import { useAudio } from "@/src/hooks/useAudio";
import { useWordDetails } from "@/src/hooks/useWordDetails";
import { Definition, Meaning } from "@/src/types";

export default function WordDetailsScreen() {
  const { word } = useLocalSearchParams<{ word: string }>();
  const decodedWord = decodeURIComponent(word || "");
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useWordDetails(decodedWord);
  const { addToHistory, isFavorite, addFavorite, removeFavorite } = useApp();
  const { isPlaying, isLoading: isAudioLoading, play } = useAudio();

  const favorite = isFavorite(decodedWord);

  useEffect(() => {
    if (decodedWord) {
      addToHistory(decodedWord);
    }
  }, [decodedWord, addToHistory]);

  const handleFavoritePress = async () => {
    if (favorite) {
      await removeFavorite(decodedWord);
    } else {
      await addFavorite(decodedWord);
    }
  };

  const handlePlayAudio = () => {
    if (data?.word) {
      play(data.word);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: decodedWord }} />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Carregando definição...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: decodedWord }} />
        <View style={styles.errorIconContainer}>
          <View style={styles.errorIconInner}>
            <Ionicons name="book-outline" size={48} color="#ff3b30" />
          </View>
        </View>
        <View style={styles.wordBadge}>
          <Text style={styles.wordBadgeText}>"{decodedWord}"</Text>
        </View>
        <Text style={styles.errorTitle}>Palavra não encontrada</Text>
        <Text style={styles.errorSubtitle}>
          Não conseguimos encontrar definições para esta palavra no dicionário.
        </Text>

        <View style={styles.errorButtonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => refetch()}
          >
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!data) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: "Detalhes",
          headerRight: () => (
            <Pressable
              onPress={handleFavoritePress}
              style={styles.headerButton}
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={24}
                color={favorite ? "#ff3b30" : "#007aff"}
              />
            </Pressable>
          ),
        }}
      />

      {/* Word Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.wordAvatar}>
            <Text style={styles.wordAvatarText}>
              {data.word.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.wordTitle}>{data.word}</Text>
            {data.phonetic && (
              <View style={styles.phoneticContainer}>
                <Ionicons
                  name="volume-medium-outline"
                  size={14}
                  color="#8e8e93"
                />
                <Text style={styles.phonetic}>{data.phonetic}</Text>
              </View>
            )}
          </View>
          {data?.word && (
            <Pressable
              onPress={handlePlayAudio}
              style={[
                styles.playButton,
                isAudioLoading && styles.playButtonLoading,
                isPlaying && styles.playButtonActive,
              ]}
              disabled={isAudioLoading || isPlaying}
            >
              {isAudioLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : isPlaying ? (
                <Ionicons name="volume-high" size={22} color="#fff" />
              ) : (
                <Ionicons name="play" size={22} color="#fff" />
              )}
            </Pressable>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data.meanings.length}</Text>
            <Text style={styles.statLabel}>
              {data.meanings.length === 1 ? "Significado" : "Significados"}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {data.meanings.reduce((acc, m) => acc + m.definitions.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Definições</Text>
          </View>
          {data.meanings.some((m) => m.synonyms.length > 0) && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {data.meanings.reduce((acc, m) => acc + m.synonyms.length, 0)}
                </Text>
                <Text style={styles.statLabel}>Sinônimos</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Meanings */}
      {data.meanings.map((meaning, index) => (
        <MeaningCard
          key={`${meaning.partOfSpeech}-${index}`}
          meaning={meaning}
          index={index}
        />
      ))}

      {/* Footer spacing */}
      <View style={styles.footer} />
    </ScrollView>
  );
}

interface MeaningCardProps {
  meaning: Meaning;
  index: number;
}

function MeaningCard({ meaning, index }: MeaningCardProps) {
  const partOfSpeechColors: Record<string, string> = {
    noun: "#007aff",
    verb: "#34c759",
    adjective: "#ff9500",
    adverb: "#af52de",
    pronoun: "#ff2d55",
    preposition: "#5ac8fa",
    conjunction: "#ffcc00",
    interjection: "#ff3b30",
  };

  const color =
    partOfSpeechColors[meaning.partOfSpeech.toLowerCase()] || "#007aff";

  return (
    <View style={styles.meaningCard}>
      {/* Part of Speech Header */}
      <View style={styles.meaningHeader}>
        <View style={[styles.partOfSpeechBadge, { backgroundColor: color }]}>
          <Text style={styles.partOfSpeechText}>{meaning.partOfSpeech}</Text>
        </View>
        <View style={[styles.meaningLine, { backgroundColor: color }]} />
      </View>

      {/* Definitions */}
      <View style={styles.definitionsContainer}>
        {meaning.definitions.map((def, idx) => (
          <DefinitionItem
            key={idx}
            definition={def}
            index={idx + 1}
            isLast={idx === meaning.definitions.length - 1}
          />
        ))}
      </View>

      {/* Synonyms */}
      {meaning.synonyms.length > 0 && (
        <View style={styles.relatedSection}>
          <View style={styles.relatedHeader}>
            <Ionicons name="add-circle-outline" size={16} color="#34c759" />
            <Text style={styles.relatedTitle}>Sinônimos</Text>
          </View>
          <View style={styles.chipsContainer}>
            {meaning.synonyms.slice(0, 8).map((syn, idx) => (
              <View key={idx} style={[styles.chip, styles.synonymChip]}>
                <Text style={styles.synonymChipText}>{syn}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Antonyms */}
      {meaning.antonyms.length > 0 && (
        <View style={styles.relatedSection}>
          <View style={styles.relatedHeader}>
            <Ionicons name="remove-circle-outline" size={16} color="#ff3b30" />
            <Text style={styles.relatedTitle}>Antônimos</Text>
          </View>
          <View style={styles.chipsContainer}>
            {meaning.antonyms.slice(0, 8).map((ant, idx) => (
              <View key={idx} style={[styles.chip, styles.antonymChip]}>
                <Text style={styles.antonymChipText}>{ant}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

interface DefinitionItemProps {
  definition: Definition;
  index: number;
  isLast: boolean;
}

function DefinitionItem({ definition, index, isLast }: DefinitionItemProps) {
  return (
    <View
      style={[styles.definitionItem, !isLast && styles.definitionItemBorder]}
    >
      <View style={styles.definitionNumber}>
        <Text style={styles.definitionNumberText}>{index}</Text>
      </View>
      <View style={styles.definitionContent}>
        <Text style={styles.definitionText}>{definition.definition}</Text>
        {definition.example && (
          <View style={styles.exampleContainer}>
            <View style={styles.exampleBar} />
            <Text style={styles.exampleText}>"{definition.example}"</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#f2f2f7",
  },
  loadingCard: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6e6e73",
    fontWeight: "500",
  },
  errorIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorIconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,59,48,0.1)",
  },
  wordBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: "#e5e5ea",
  },
  wordBadgeText: {
    fontSize: 17,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#000",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
  },
  errorSubtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
    color: "#6e6e73",
  },
  suggestionsContainer: {
    marginTop: 24,
    alignItems: "flex-start",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#6e6e73",
  },
  errorButtonsContainer: {
    marginTop: 32,
    width: "100%",
    gap: 12,
  },
  retryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#007aff",
    gap: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#e5e5ea",
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  headerButton: {
    padding: 8,
  },
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
  },
  wordAvatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  wordTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
  },
  phoneticContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  phonetic: {
    fontSize: 16,
    color: "#8e8e93",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007aff",
  },
  playButtonLoading: {
    backgroundColor: "#ff9500",
  },
  playButtonActive: {
    backgroundColor: "#34c759",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f7",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007aff",
  },
  statLabel: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#e5e5ea",
  },
  meaningCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  meaningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  partOfSpeechBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  partOfSpeechText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  meaningLine: {
    flex: 1,
    height: 2,
    marginLeft: 12,
    borderRadius: 1,
    opacity: 0.3,
  },
  definitionsContainer: {
    gap: 0,
  },
  definitionItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  definitionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  definitionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f2f2f7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  definitionNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8e8e93",
  },
  definitionContent: {
    flex: 1,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
  },
  exampleContainer: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    paddingLeft: 0,
    overflow: "hidden",
  },
  exampleBar: {
    width: 3,
    backgroundColor: "#007aff",
    borderRadius: 2,
    marginRight: 12,
  },
  exampleText: {
    flex: 1,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    color: "#6e6e73",
  },
  relatedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f7",
  },
  relatedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6e6e73",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  synonymChip: {
    backgroundColor: "rgba(52, 199, 89, 0.12)",
  },
  synonymChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#248a3d",
  },
  antonymChip: {
    backgroundColor: "rgba(255, 59, 48, 0.12)",
  },
  antonymChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#d70015",
  },
  footer: {
    height: 20,
  },
});
