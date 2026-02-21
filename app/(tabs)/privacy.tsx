
import { StyleSheet, View, Text, ScrollView, Platform } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
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
  section: {
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
  highlightBox: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
  },
});

export default function PrivacyScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Privacy & Security",
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Privacy & Security</Text>
          <Text style={styles.subtitle}>
            Your privacy is our top priority. Learn how we protect your data.
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>🔒 Privacy-First Design</Text>
          <Text style={styles.highlightText}>
            Renovation Reality Check is built with privacy at its core. We don't collect, store, or share your personal information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Don't Do</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="person.slash.fill" 
                android_material_icon_name="person-off" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>No User Accounts</Text>
              <Text style={styles.featureDescription}>
                No registration, no login, no passwords. Use the app instantly without creating an account.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="photo.slash.fill" 
                android_material_icon_name="hide-image" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>No Photo Storage</Text>
              <Text style={styles.featureDescription}>
                Your photos are processed immediately and never stored on our servers. They're deleted right after analysis.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="envelope.slash.fill" 
                android_material_icon_name="email-off" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>No Email Collection</Text>
              <Text style={styles.featureDescription}>
                We don't ask for your email address or any contact information.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="chart.bar.slash.fill" 
                android_material_icon_name="analytics-off" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>No Personal Analytics</Text>
              <Text style={styles.featureDescription}>
                We don't track your behavior or collect analytics that could identify you.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <Text style={styles.bulletPoint}>
            • You take a photo of your room using your device camera
          </Text>
          <Text style={styles.bulletPoint}>
            • The photo is sent securely to our AI for analysis
          </Text>
          <Text style={styles.bulletPoint}>
            • Our AI detects the room type and generates cost estimates
          </Text>
          <Text style={styles.bulletPoint}>
            • Results are sent back to your device
          </Text>
          <Text style={styles.bulletPoint}>
            • The photo is immediately deleted from our servers
          </Text>
          <Text style={styles.bulletPoint}>
            • No data is stored or linked to you
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="lock.shield.fill" 
                android_material_icon_name="security" 
                size={20} 
                color={colors.secondary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Encrypted Transmission</Text>
              <Text style={styles.featureDescription}>
                All data sent to our servers is encrypted using industry-standard HTTPS/TLS protocols.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="trash.fill" 
                android_material_icon_name="delete" 
                size={20} 
                color={colors.secondary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Immediate Deletion</Text>
              <Text style={styles.featureDescription}>
                Photos are automatically deleted from our servers within seconds of processing.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="eye.slash.fill" 
                android_material_icon_name="visibility-off" 
                size={20} 
                color={colors.secondary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>No Human Access</Text>
              <Text style={styles.featureDescription}>
                Your photos are only processed by AI. No human ever sees or reviews your images.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Questions?</Text>
          <Text style={styles.highlightText}>
            If you have any questions about our privacy practices, please contact us. We're committed to transparency and protecting your privacy.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
