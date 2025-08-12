import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  onValue,
  push,
  ref,
  remove,
  set,
  updateDoc,
} from "firebase/database";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import { auth, database } from "../../firebaseConfig";
import { useTheme } from "../../themeContext";

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
  const [showInput, setShowInput] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { theme, isDarkMode } = useTheme();

  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode
          ? offsetY > 23
            ? "#121212"
            : "#000"
          : "#fff",
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        },
      });
    }, [isDarkMode, navigation])
  );

  // Floating + button position
  const pan = useRef(new Animated.ValueXY({ x: 320, y: 36 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {},
    })
  ).current;

  function formatGhanaNumber(number: string): string {
    let cleaned = number.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    return `+233${cleaned}`;
  }

  const addContact = async () => {
    if (!name || !phone || !relationship) {
      Alert.alert("Missing Info", "Please fill in all fields");
      return;
    }

    if (contacts.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 contacts");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    // Format the phone number before saving
    const formattedPhone = formatGhanaNumber(phone);

    const contactsRef = ref(database, `users/${user.uid}/emergencyContacts`);
    const newContactRef = push(contactsRef);
    await set(newContactRef, {
      id: newContactRef.key,
      name,
      phone: formattedPhone, // Save formatted number
      relationship,
    });

    const firestore = getFirestore();
    const userDocRef = doc(firestore, "users", user.uid);
    await updateDoc(userDocRef, {
      emergencyContacts: arrayUnion({
        id: newContactRef.key,
        name,
        phone: formattedPhone,
        relationship,
      }),
    });

    setName("");
    setPhone("");
    setRelationship("");
    setShowInput(false);
  };

  const confirmRemoveContact = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteContact = async () => {
    if (confirmDeleteId) {
      const user = auth.currentUser;
      if (!user) return;

      const contactRef = ref(
        database,
        `users/${user.uid}/emergencyContacts/${confirmDeleteId}`
      );
      await remove(contactRef);

      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, {
        emergencyContacts: arrayRemove({
          id: confirmDeleteId,
          name,
          phone,
          relationship,
        }),
      });

      setConfirmDeleteId(null);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const contactsRef = ref(database, `users/${user.uid}/emergencyContacts`);
    const unsubscribe = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Convert object to array
      setContacts(Object.values(data));
    });

    return () => unsubscribe();
  }, []);

  // --- Swipeable Delete Button ---
  const renderRightActions = (item: Contact) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => confirmRemoveContact(item.id)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? theme.card : theme.background,
        }}
      >
        {/* Movable Floating + button */}
        {!showInput && (
          <Animated.View
            style={[styles.floatingAddButton, pan.getLayout()]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity onPress={() => setShowInput(true)}>
              <Ionicons name="add-circle" size={44} color="#ff5330" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Input Modal */}
        {showInput && (
          <KeyboardAvoidingView
            style={styles.inputOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowInput(false)}
              >
                <Ionicons name="close" size={24} color="#ff5330" />
              </TouchableOpacity>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Text style={styles.label}>Relationship</Text>
              <TextInput
                placeholder="e.g. Mother, Friend"
                style={styles.input}
                value={relationship}
                onChangeText={setRelationship}
              />
              <TouchableOpacity style={styles.addButton} onPress={addContact}>
                <Ionicons
                  name="add-circle"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.addButtonText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          visible={!!confirmDeleteId}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmDeleteId(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Ionicons
                name="warning"
                size={40}
                color="#ff5330"
                style={{ alignSelf: "center" }}
              />
              <Text style={styles.modalTitle}>Delete Contact?</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete this contact?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#ff5330" }]}
                  onPress={handleDeleteContact}
                >
                  <Text style={styles.modalBtnText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                  onPress={() => setConfirmDeleteId(null)}
                >
                  <Text style={[styles.modalBtnText, { color: "#333" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <View style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Ionicons
                    name="person-circle"
                    size={32}
                    color="#ff5330"
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                    <Text style={styles.contactRelationship}>
                      {item.relationship}
                    </Text>
                  </View>
                </View>
                {/* Remove the old delete button here */}
              </View>
            </Swipeable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-circle-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No contacts added yet.</Text>
              <Text style={styles.emptySubText}>
                Add trusted contacts to be notified in case of emergency.
              </Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1, paddingTop: 80 }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  floatingAddButton: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 22,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  inputOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  inputContainer: {
    width: "90%",
    gap: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    padding: 4,
  },
  label: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
    marginTop: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ff5330",
    padding: 10,
    borderRadius: 8,
    color: "#000",
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#ff5330",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 2,
  },
  contactItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    justifyContent: "space-between",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 16,
    color: "#555",
    marginBottom: 2,
  },
  contactRelationship: {
    fontSize: 15,
    color: "#ff5330",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 20,
    color: "#aaa",
    marginTop: 10,
    fontWeight: "bold",
  },
  emptySubText: {
    fontSize: 15,
    color: "#bbb",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    width: "80%",
    alignItems: "center",
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff5330",
    marginTop: 10,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff5330",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
