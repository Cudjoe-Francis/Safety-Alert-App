import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EnablePreferencesScreen = () => {
  const router = useRouter();

  const [preferences, setPreferences] = useState({
    notifications: true,
    vibration: true,
    autoSendLocation: false,
    voiceAlert: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.title}>Enable Preferences</Text>
      </View>

      <View style={styles.inner}>
        {Object.entries(preferences).map(([key, value]) => (
          <View style={styles.preferenceItem} key={key}>
            <Text style={styles.label}>{getLabelText(key)}</Text>
            <Switch
              value={value}
              onValueChange={() => togglePreference(key as keyof typeof preferences)}
              trackColor={{ false: '#ccc', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default EnablePreferencesScreen;

const getLabelText = (key: string) => {
  switch (key) {
    case 'notifications':
      return 'Enable Notifications';
    case 'vibration':
      return 'Enable Vibration on Alert';
    case 'autoSendLocation':
      return 'Auto-Send Location';
    case 'voiceAlert':
      return 'Enable Voice Alert';
    default:
      return key;
  }
};

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
    color: '#333',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});
