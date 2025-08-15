import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const TermsAndConditionsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
         
          <Text style={styles.text}>
            By using this app, you agree to the following terms and conditions:
            {"\n\n"}
            1. You are responsible for the accuracy of the information you
            provide.{"\n\n"}
            2. The app is provided &ldquo;as is&ldquo; without warranty of any kind.
            {"\n\n"}
            3. We are not liable for any damages or losses resulting from the
            use of this app.{"\n\n"}
            4. Your data is stored securely and will not be shared with third
            parties except as required by law.{"\n\n"}
            5. You agree to use the app in accordance with all applicable laws
            and regulations.{"\n\n"}
            For full details, please contact support or visit our website.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 10,
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
    marginTop: 8,
  },
});
