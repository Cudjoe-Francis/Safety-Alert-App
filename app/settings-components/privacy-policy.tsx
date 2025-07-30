import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "..//../themeContext";

const PrivacyPolicyScreen = () => {

          const { isDarkMode, theme } = useTheme();
  
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode? theme.card : theme.background }]}>
      <View style={[styles.header, { borderColor: isDarkMode? '#363636' : '#eee' }]}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#ff5330" />
        </Pressable>
        <Text style={[styles.title, { color: isDarkMode? '#fff' : '#000' }]}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: isDarkMode? '#fff' : '#000' }]}>
          This Safety Alert App respects your privacy. We only collect the
          necessary data to help protect you in emergencies. We do not share or
          sell your personal information. All location data is used only during
          alert activation and is not stored or shared with third parties. By
          using this app, you agree to our data practices.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
