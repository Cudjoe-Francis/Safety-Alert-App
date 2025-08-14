import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const TermsAndConditionsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          By using the Safety Alert App, you agree to the following terms:
          {"\n\n"}
          1. You will use the app for emergency purposes only.{"\n\n"}
          2. You consent to the use of location data during alerts.{"\n\n"}
          3. We are not liable for any misuse of the app or failure of
          third-party services.{"\n\n"}
          4. These terms may change without notice.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});
