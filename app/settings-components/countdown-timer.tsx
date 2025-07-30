import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "..//../themeContext";


const timerOptions = ['5 seconds', '10 seconds', '15 seconds', '30 seconds'];

const CountdownTimerScreen = () => {
        const { isDarkMode, theme } = useTheme();
  
  const router = useRouter();
  const [selectedTimer, setSelectedTimer] = useState<string | null>('10 seconds');

  const handleSelect = (option: string) => {
    setSelectedTimer(option);
  };

  const handleSave = () => {
    if (!selectedTimer) {
      Alert.alert('No time selected', 'Please select a countdown time.');
    } else {
      Alert.alert('Saved', `Countdown set to: ${selectedTimer}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode? theme.card : theme.background }]}>
      <View style={[styles.header, { borderColor: isDarkMode? '#363636' : '#eee' }]}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#ff5330" />
        </Pressable>
        <Text  style={[styles.title, { color: isDarkMode? '#fff' : '#000' }]}>Countdown Timer</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text   style={[styles.infoText, { color: isDarkMode? '#fff' : '#000' }]}>
          When an alert is triggered, a countdown will begin. If not cancelled in time, it will notify the selected security agencies.
        </Text>

        {timerOptions.map(option => (
          <Pressable
            key={option}
            style={styles.optionItem}
            onPress={() => handleSelect(option)}
          >
            <Ionicons
              name={selectedTimer === option ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color="#ff5330"
              style={{ marginRight: 10 }}
            />
            <Text   style={[styles.optionText, { color: isDarkMode? '#fff' : '#000' }]}>{option}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Timer</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CountdownTimerScreen;

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
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#ff5330',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
