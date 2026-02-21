
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  cameraButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cameraButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  galleryButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.border,
  },
  galleryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  galleryButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default function HomeScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const requestCameraPermission = async () => {
    console.log('User tapped Take Photo button');
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Camera permission denied');
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return false;
    }
    return true;
  };

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      console.log('Converting image to base64:', uri);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Base64 conversion successful, length:', base64.length);
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image');
    }
  };

  const handleTakePhoto = async () => {
    if (isProcessing) {
      console.log('Already processing, ignoring tap');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Requesting camera permission');
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setIsProcessing(false);
        return;
      }

      console.log('Opening camera');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        base64: false,
      });

      console.log('Camera result:', { canceled: result.canceled, assetsLength: result.assets?.length });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Photo captured, URI:', asset.uri);
        
        const imageBase64 = await convertImageToBase64(asset.uri);
        
        console.log('Navigating to analysis screen');
        router.push({
          pathname: '/analysis',
          params: { 
            imageUri: asset.uri, 
            imageBase64: imageBase64 
          },
        });
      } else {
        console.log('Photo capture cancelled by user');
      }
    } catch (error) {
      console.error('Error in handleTakePhoto:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChooseFromGallery = async () => {
    if (isProcessing) {
      console.log('Already processing, ignoring tap');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('User tapped Choose from Gallery button');
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Gallery permission denied');
        Alert.alert('Permission Required', 'Gallery permission is required to choose photos');
        setIsProcessing(false);
        return;
      }

      console.log('Opening gallery');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        base64: false,
      });

      console.log('Gallery result:', { canceled: result.canceled, assetsLength: result.assets?.length });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Photo selected from gallery, URI:', asset.uri);
        
        const imageBase64 = await convertImageToBase64(asset.uri);
        
        console.log('Navigating to analysis screen');
        router.push({
          pathname: '/analysis',
          params: { 
            imageUri: asset.uri, 
            imageBase64: imageBase64 
          },
        });
      } else {
        console.log('Gallery selection cancelled by user');
      }
    } catch (error) {
      console.error('Error in handleChooseFromGallery:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Renovation Reality Check",
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Renovation Reality Check</Text>
          <Text style={styles.subtitle}>
            Get instant, honest cost estimates for your renovation project. No login required.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.cameraButton} 
          onPress={handleTakePhoto}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          <View style={styles.cameraButtonContent}>
            <IconSymbol 
              ios_icon_name="camera.fill" 
              android_material_icon_name="camera" 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.galleryButton} 
          onPress={handleChooseFromGallery}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          <View style={styles.galleryButtonContent}>
            <IconSymbol 
              ios_icon_name="photo.fill" 
              android_material_icon_name="photo" 
              size={24} 
              color={colors.text} 
            />
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="camera.fill" 
                android_material_icon_name="camera" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>1. Take a Photo</Text>
              <Text style={styles.featureDescription}>
                Capture a photo of the room you want to renovate
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="sparkles" 
                android_material_icon_name="auto-awesome" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>2. AI Analysis</Text>
              <Text style={styles.featureDescription}>
                Our AI detects the room type and analyzes renovation potential
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="dollarsign.circle.fill" 
                android_material_icon_name="attach-money" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>3. Get Estimates</Text>
              <Text style={styles.featureDescription}>
                Receive 3 renovation scenarios with detailed cost breakdowns
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            🔒 Privacy First: Photos are not stored or uploaded. All analysis happens securely and your data stays private.
          </Text>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Estimates are averages and not contractor quotes. Always consult with licensed professionals for accurate pricing.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
