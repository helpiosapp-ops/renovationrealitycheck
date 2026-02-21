import { StyleSheet } from 'react-native';

// Renovation Reality Check Color Palette
// Clean, professional, trust-building colors
export const colors = {
  // Light theme
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  primary: '#2563EB', // Professional blue
  secondary: '#10B981', // Success green
  accent: '#F59E0B', // Warning amber
  highlight: '#EFF6FF', // Light blue highlight
  border: '#E5E7EB',
  error: '#EF4444',

  // Dark theme
  darkBackground: '#0F172A',
  darkCard: '#1E293B',
  darkText: '#F1F5F9',
  darkTextSecondary: '#94A3B8',
  darkBorder: '#334155',

  // Legacy aliases (kept for backward compatibility)
  backgroundAlt: '#F8F9FA',
  grey: '#6B7280',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: 'white',
  },
});
