import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";

const DeveloperInfoScreen = () => {
  //233203424242
  const handleWhatsApp = () => {
    const phoneNumber = "233256782612";
    const message = "Hello, I need assistance with the Safety Alert App.";
    Linking.openURL(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    ).catch(() => {
      alert(
        "Make sure WhatsApp is installed on your device otherwise you can contact the developer via the email"
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          This app was developed by:
          {"\n\n"}👨‍💻 Name: Francis Cudjoe{"\n"}
          📧 Email: cudjoefrancis1225@example.com{"\n"}
          📍 Location: Ghana{"\n\n"}
          For feedback or questions, feel free to reach out.
        </Text>

        <Pressable onPress={handleWhatsApp}>
          <Text style={styles.link}>Contact Developer</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default DeveloperInfoScreen;

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
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: "#ff5330",
    fontWeight: "600",
  },
});
