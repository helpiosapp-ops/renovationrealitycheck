
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import Constants from "expo-constants";

interface RenovationScenario {
  name: string;
  totalCostMin: number;
  totalCostMax: number;
  materialsCost: number;
  laborCost: number;
  timeEstimate: string;
  permitLikelihood: string;
  valueImpact: number;
  roiRating: string;
  description: string;
}

interface AnalysisResult {
  roomType: string;
  scenarios: RenovationScenario[];
  disclaimer?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 68 : 20,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roomImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  roomTypeContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomTypeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  roomTypeValue: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  scenarioCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scenarioName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  roiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  costRange: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  disclaimer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function AnalysisScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const imageUri = params.imageUri as string;
  const imageBase64 = params.imageBase64 as string;

  const analyzeRoom = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[API] Sending image to backend for analysis');

      const backendUrl =
        (Constants.expoConfig?.extra?.backendUrl as string) ||
        'https://jsmbe3gjnvnrz2kevzu5wtdf4s2ftxae.app.specular.dev';

      const url = `${backendUrl}/api/analyze-room`;
      console.log('[API] Requesting POST', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.error) {
            errorMessage = errorBody.error;
          }
        } catch {
          console.log('Could not parse error response body');
        }
        console.error('[API] Error from /api/analyze-room:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[API] Response from /api/analyze-room:', JSON.stringify(data).slice(0, 300));

      const analysisResult: AnalysisResult = {
        roomType: data.roomType,
        scenarios: data.scenarios,
      };

      console.log('Analysis complete, room type:', analysisResult.roomType);
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to analyze the room. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64]);

  useEffect(() => {
    console.log('Analysis screen mounted, starting analysis');
    analyzeRoom();
  }, [analyzeRoom]);

  const getRoiBadgeColor = (rating: string) => {
    const ratingLower = rating.toLowerCase();
    if (ratingLower === 'high') return colors.secondary;
    if (ratingLower === 'medium') return colors.accent;
    return colors.textSecondary;
  };

  const formatCurrency = (amount: number) => {
    const formatted = `$${amount.toLocaleString()}`;
    return formatted;
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Analyzing Room",
            headerShown: true,
          }}
        />
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.roomImage} resizeMode="cover" />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Analyzing your room...</Text>
            <Text style={styles.loadingSubtext}>
              Our AI is detecting the room type and calculating renovation estimates
            </Text>
          </View>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Analysis Error",
            headerShown: true,
          }}
        />
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle.fill" 
              android_material_icon_name="error" 
              size={64} 
              color={colors.error} 
            />
            <Text style={styles.errorText}>Analysis Failed</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={analyzeRoom}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  if (!result) {
    return null;
  }

  const costRangeText = `${formatCurrency(result.scenarios[0].totalCostMin)} - ${formatCurrency(result.scenarios[result.scenarios.length - 1].totalCostMax)}`;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Renovation Estimates",
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.roomImage} resizeMode="cover" />
        </View>

        <View style={styles.roomTypeContainer}>
          <IconSymbol 
            ios_icon_name="house.fill" 
            android_material_icon_name="home" 
            size={24} 
            color={colors.primary} 
          />
          <View>
            <Text style={styles.roomTypeLabel}>DETECTED ROOM TYPE</Text>
            <Text style={styles.roomTypeValue}>{result.roomType}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Renovation Scenarios</Text>

        {result.scenarios.map((scenario, index) => {
          const costMin = formatCurrency(scenario.totalCostMin);
          const costMax = formatCurrency(scenario.totalCostMax);
          const costRangeDisplay = `${costMin} - ${costMax}`;
          const materialsDisplay = formatCurrency(scenario.materialsCost);
          const laborDisplay = formatCurrency(scenario.laborCost);
          const valueImpactDisplay = `+${scenario.valueImpact}%`;
          const roiColor = getRoiBadgeColor(scenario.roiRating);

          return (
            <View key={index} style={styles.scenarioCard}>
              <View style={styles.scenarioHeader}>
                <Text style={styles.scenarioName}>{scenario.name}</Text>
                <View style={[styles.roiBadge, { backgroundColor: roiColor }]}>
                  <Text style={styles.roiBadgeText}>{scenario.roiRating} ROI</Text>
                </View>
              </View>

              <Text style={styles.costRange}>{costRangeDisplay}</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Materials</Text>
                <Text style={styles.detailValue}>{materialsDisplay}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Labor</Text>
                <Text style={styles.detailValue}>{laborDisplay}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time Estimate</Text>
                <Text style={styles.detailValue}>{scenario.timeEstimate}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Permit Likelihood</Text>
                <Text style={styles.detailValue}>{scenario.permitLikelihood}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Home Value Impact</Text>
                <Text style={styles.detailValue}>{valueImpactDisplay}</Text>
              </View>

              <Text style={styles.description}>{scenario.description}</Text>
            </View>
          );
        })}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ {result.disclaimer
              ? result.disclaimer
              : 'These estimates are averages based on typical projects and are not contractor quotes. Actual costs may vary based on your location, materials chosen, and project complexity. Always consult with licensed professionals for accurate pricing.'}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
