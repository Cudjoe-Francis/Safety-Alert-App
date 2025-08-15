import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const developer = {
  name: "Francis Cudjoe",
  role: "Lead Developer",
  email: "cudjoefrancis1225@example.com",
  website: "https://johndoe.dev",
  // avatar: "https://placehold.co/80x80/ff5330/fff?text=JD",
  avatar: require("../../assets/images/profile_picture.jpeg"),
};

const handleWhatsApp = () => {
  const phoneNumber = "233256782612";
  const message = "Hello, I need assistance with the Safety Alert App.";
  Linking.openURL(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  ).catch(() => {
    alert(
      "Make sure WhatsApp is installed on your device, otherwise you can contact the developer via email."
    );
  });
};

const DeveloperInfoScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <Image source={developer.avatar} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{developer.name}</Text>
          <Text style={styles.role}>{developer.role}</Text>
          <View style={styles.contactList}>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL(`mailto:${developer.email}`)}
            >
              <MaterialIcons name="email" size={22} color="#ff5330" />
              <Text style={styles.contactText}>{developer.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL(developer.website)}
            >
              <FontAwesome name="globe" size={22} color="#ff5330" />
              <Text style={styles.contactText}>{developer.website}</Text>
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
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(developer.website)}
          >
            <Text style={styles.buttonText}>Visit Website</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DeveloperInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#ff5330",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  avatarWrapper: {
    // shadowColor: "#ff5330",//delete this
    shadowColor: "#fdd8d1ff",
    // shadowOpacity: 0.18,//delete this
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    borderRadius: 50,
    marginBottom: 18,
  },

   

     
      
    
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    // borderWidth: 2,
    // borderWidth: 0.1,///delete this
    borderColor: "#ff5330",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    textAlign: "center",
  },
  role: {
    fontSize: 16,
    color: "#555",
    marginBottom: 22,
    textAlign: "center",
  },
  contactList: {
    width: "100%",
    marginBottom: 18,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 6,
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
  button: {
    marginTop: 10,
    backgroundColor: "#ff5330",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
