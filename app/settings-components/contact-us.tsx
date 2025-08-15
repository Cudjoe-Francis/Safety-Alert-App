import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const contact = {
  email: "support@safetyalert.com",
  phone: "+233256782612",
  whatsapp: "233256782612",
  website: "https://safetyalert.com",
};

const handleWhatsApp = () => {
  const message = "Hello, I need help with the Safety Alert App.";
  Linking.openURL(
    `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`
  ).catch(() => {
    alert("WhatsApp is not installed. Please use another contact method.");
  });
};

const ContactUsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MaterialIcons name="contact-support" size={28} color="#ff5330" />
            <Text style={styles.title}>Contact Us</Text>
          </View>
          <Text style={styles.text}>
            We're here to help! Reach out to us using any of the methods below.
          </Text>
          <View style={styles.contactList}>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL(`mailto:${contact.email}`)}
            >
              <MaterialIcons name="email" size={22} color="#ff5330" />
              <Text style={styles.contactText}>{contact.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL(`tel:${contact.phone}`)}
            >
              <MaterialIcons name="phone" size={22} color="#ff5330" />
              <Text style={styles.contactText}>{contact.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={handleWhatsApp}
            >
              <FontAwesome name="whatsapp" size={22} color="#25D366" />
              <Text style={[styles.contactText, { color: "#25D366" }]}>
                WhatsApp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL(contact.website)}
            >
              <FontAwesome name="globe" size={22} color="#ff5330" />
              <Text style={styles.contactText}>{contact.website}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ContactUsScreen;

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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 18,
  },
  contactList: {
    width: "100%",
    marginTop: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f6f7fb",
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#ff5330",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
