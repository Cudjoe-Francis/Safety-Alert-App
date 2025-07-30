import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useTheme } from "..//../themeContext";


const VersionScreen = () => {

        const { isDarkMode, theme } = useTheme();
  
  const router = useRouter();

  const appVersion = Constants.expoConfig?.version ?? 'N/A';
  const buildNumber =
    Constants.expoConfig?.extra?.eas?.buildNumber ??
    Constants.expoConfig?.ios?.buildNumber ??
    'N/A';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode? theme.card : theme.background }]}>
      <View style={[styles.header, { borderColor: isDarkMode? '#363636' : '#eee' }]}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#ff5330" />
        </Pressable>
        <Text style={[styles.title, { color: isDarkMode? '#fff' : '#000' }]}>App Version</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.infoRow, { borderColor: isDarkMode? '#363636' : '#eee' }]}>
          <Text style={[styles.label, { color: isDarkMode? '#fff' : '#000' }]}>Version:</Text>
          <Text style={[styles.value, { color: isDarkMode? '#fff' : '#000' }]}>{appVersion}</Text>
        </View>
        <View style={[styles.infoRow, { borderColor: isDarkMode? '#363636' : '#eee' }]}>
          <Text style={[styles.label, { color: isDarkMode? '#fff' : '#000' }]}>Build:</Text>
          <Text style={[styles.value, { color: isDarkMode? '#fff' : '#000' }]}>{buildNumber}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VersionScreen;

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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    // borderColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});
