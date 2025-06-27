import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

type Contact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
};

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const addContact = () => {
    if (!name || !phone || !relationship) {
      Alert.alert("Missing Info", "Please fill in all fields");
      return;
    }

    if (contacts.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 contacts");
      return;
    }

    setContacts([
      ...contacts,
      {
        id: Date.now().toString(),
        name,
        phone,
        relationship,
      },
    ]);

    setName("");
    setPhone("");
    setRelationship("");
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Relationship (e.g. Mother)"
          style={styles.input}
          value={relationship}
          onChangeText={setRelationship}
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View>
              <Text style={styles.contactText}>
                {item.name} ({item.relationship})
              </Text>
              <Text style={styles.contactSubText}>{item.phone}</Text>
            </View>
            <TouchableOpacity onPress={() => removeContact(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No contacts added yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  inputContainer: {
    marginBottom: 20,
    gap: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 5,
  },

  addButton: {
    backgroundColor: "#ff5330",
    padding: 10,
    borderRadius: 5,
  },

  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  contactItem: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  contactText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  contactSubText: {
    fontSize: 14,
    color: "#555",
  },

  removeText: {
    color: "red",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
