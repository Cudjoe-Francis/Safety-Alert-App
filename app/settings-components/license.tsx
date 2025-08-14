import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const LicencesScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          This app uses open-source libraries and tools, which are licensed as
          follows:
          {"\n\n"}• React Native{"\n"}• Expo{"\n"}•
          react-native-safe-area-context{"\n"}• @expo/vector-icons{"\n\n"}
          Full license texts are available on their respective GitHub
          repositories.
        </Text>
      </ScrollView>
    </View>
  );
};

export default LicencesScreen;

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
