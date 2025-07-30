import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "..//../themeContext";


const DeveloperInfoScreen = () => {

      const { isDarkMode, theme } = useTheme();
  
  const router = useRouter();

  const handleEmail = () => {
    Linking.openURL('mailto:developer@example.com');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode? theme.card : theme.background }]}>
      <View style={[styles.header, { borderColor: isDarkMode? '#363636' : '#eee' }]}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#ff5530" />
        </Pressable>
        <Text style={[styles.title, { color: isDarkMode? '#fff' : '#000' }]}>Developer Info</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: isDarkMode? '#fff' : '#000' }]}>
          This app was developed by:
          {'\n\n'}👨‍💻 Name: Francis Cudjoe{'\n'}
          📧 Email: developer@example.com{'\n'}
          📍 Location: Ghana{'\n\n'}
          For feedback or questions, feel free to reach out.
        </Text>

        <Pressable onPress={handleEmail}>
          <Text style={styles.link}>Contact Developer</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeveloperInfoScreen;

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
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: '#ff5330',
    fontWeight: '600',
  },
});
