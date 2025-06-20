import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FAQsScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.title}>FAQs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.q}>1. How does the app work?</Text>
        <Text style={styles.a}>
          The app sends alerts to selected security agencies with your live location.
        </Text>

        <Text style={styles.q}>2. Is my location tracked all the time?</Text>
        <Text style={styles.a}>
          No. Location is only used during an active alert and not stored.
        </Text>

        <Text style={styles.q}>3. Can I choose which agencies get my alerts?</Text>
        <Text style={styles.a}>
          Yes. You can select preferred security agencies from the settings.
        </Text>

        <Text style={styles.q}>4. Does the app work offline?</Text>
        <Text style={styles.a}>
          Some features may not work without internet, especially sending alerts.
        </Text>

        <Text style={styles.q}>5. Is the app free?</Text>
        <Text style={styles.a}>
          Yes, the app is free to use. Some future features may be paid.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQsScreen;

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
  q: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    color: '#333',
  },
  a: {
    fontSize: 15,
    color: '#555',
    marginTop: 5,
  },
});
