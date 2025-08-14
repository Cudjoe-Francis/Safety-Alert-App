import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const PrivacyPolicyScreen = () => {

  

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          This Safety Alert App respects your privacy. We only collect the
          necessary data to help protect you in emergencies. We do not share or
          sell your personal information. All location data is used only during
          alert activation and is not stored or shared with third parties. By
          using this app, you agree to our data practices.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
