import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "..//../themeContext";


const LocationServicesScreen = () => {

    const { isDarkMode, theme } = useTheme();
  
  const router = useRouter();

  const openLocationSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('App-Prefs:Privacy&path=LOCATION');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open settings.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode? theme.card : theme.background }]}>
      <View style={[styles.header, { borderColor: isDarkMode? '#363636' : '#eee' }]}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#ff5330" />
        </Pressable>
        <Text style={[styles.title, { color: isDarkMode? '#fff' : '#000' }]}>Location Services</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: isDarkMode? '#fff' : '#000' }]}>
          The Safety Alert App uses your location to:
          {'\n\n'}• Notify security agencies of your exact position
          {'\n'}• Help responders reach you faster
          {'\n\n'}You can enable or disable location access in your device`s settings.
        </Text>

        <Pressable style={styles.button} onPress={openLocationSettings}>
          <Text style={styles.buttonText}>Open Location Settings</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    // borderColor: '#eee',
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
  button: {
    backgroundColor: '#ff5330',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
