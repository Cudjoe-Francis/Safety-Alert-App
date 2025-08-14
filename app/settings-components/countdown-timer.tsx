import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const timerOptions = ['5 seconds', '10 seconds', '15 seconds', '30 seconds', '120 seconds', '300 seconds'];

const CountdownTimerScreen = () => {
  const router = useRouter();
  const [selectedTimer, setSelectedTimer] = useState<string | null>(null);

  // Load saved timer on mount
  useEffect(() => {
    const loadTimer = async () => {
      try {
        const savedTime = await AsyncStorage.getItem('countdownTimerLabel');
        if (savedTime) {
          setSelectedTimer(savedTime);
        } else {
          setSelectedTimer('10 seconds');
        }
      } catch (error) {
        console.error('Error loading timer:', error);
      }
    };
    loadTimer();
  }, []);

  const handleSelect = async (option: string) => {
    try {
      setSelectedTimer(option);
      await AsyncStorage.setItem('countdownTimerLabel', option);
      const timeInSeconds = parseInt(option);
      await AsyncStorage.setItem('countdownTimer', timeInSeconds.toString());
    } catch (error) {
      console.error('Error saving selected timer:', error);
    }
  };

  const handleSave = () => {
    if (!selectedTimer) {
      Alert.alert('No time selected', 'Please select a countdown time.');
    } else {
      Alert.alert('Saved', `Countdown set to: ${selectedTimer}`);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      

      <View style={styles.content}>
        <Text style={styles.infoText}>
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
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Timer</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CountdownTimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
