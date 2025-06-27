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

const agenciesList = [
  'Police',
  'Fire Service',
  'Ambulance',
  'Private Security',
  'Campus Security',
  'Neighborhood Watch',
];

const SelectSecurityAgenciesScreen = () => {
  const router = useRouter();
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);

  const toggleAgency = (agency: string) => {
    if (selectedAgencies.includes(agency)) {
      setSelectedAgencies(selectedAgencies.filter(item => item !== agency));
    } else {
      setSelectedAgencies([...selectedAgencies, agency]);
    }
  };

  const handleSave = () => {
    if (selectedAgencies.length === 0) {
      Alert.alert('No agency selected', 'Please select at least one agency.');
    } else {
      Alert.alert('Saved', `Selected: ${selectedAgencies.join(', ')}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#ff5330" />
        </Pressable>
        <Text style={styles.title}>Select Security Agencies</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {agenciesList.map(agency => (
          <Pressable
            key={agency}
            style={styles.agencyItem}
            onPress={() => toggleAgency(agency)}
          >
            <Ionicons
              name={selectedAgencies.includes(agency) ? 'checkbox' : 'square-outline'}
              size={24}
              color="#ff5330"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.agencyText}>{agency}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Selection</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectSecurityAgenciesScreen;

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
  agencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  agencyText: {
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
