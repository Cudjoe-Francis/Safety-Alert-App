import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const LicencesScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          
          <Text style={styles.text}>
            This app and its source code are licensed under the MIT License.
            {"\n\n"}
            Copyright © 2025 Francis Cudjoe. All rights reserved.
            {"\n\n"}
            You are free to use, modify, and distribute this software in
            accordance with the license terms.
            {"\n\n"}
            For third-party libraries, please refer to their respective
            licenses.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LicencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
    // alignItems: "center",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    elevation: 6,
    shadowColor: "#ff5330",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 26,
  },
});
