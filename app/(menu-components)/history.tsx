import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import {
  // collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import { firestore } from "../../firebaseConfig";
import { useTheme } from "../../themeContext";
// import { getUserHistory } from "../../utils/getUserHistory";

const serviceColors: Record<string, string> = {
  police: "#121a68",
  hospital: "#008000",
  fire: "red",
  campus: "#5d3fd3",
  incident: "#ff5330",
  sos: "#ff5330",
};

const serviceIcons: Record<string, any> = {
  police: "shield",
  hospital: "medkit",
  fire: "flame",
  campus: "school",
  incident: "alert-circle",
  sos: "call",
};

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;
    const db = getDatabase();
    const historyRef = ref(db, `users/${userId}/history`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Convert object to array with keys
      const arr = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setHistory(arr.reverse());
      setLoading(false);
      console.log("Fetched history:", arr); // Debug log
    });
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        },
      });
    }, [isDarkMode, navigation])
  );

  const handleScroll = (event: any) => {
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

  const handleReplyPress = (reply: any) => {
    router.push({
      pathname: "/(menu-components)/ReplyDetails",
      params: { reply: JSON.stringify(reply) },
    });
  };

  const confirmRemoveHistory = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteHistory = async () => {
    if (!confirmDeleteId) return;
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Delete from Firestore (alerts)
      try {
        await deleteDoc(doc(firestore, "alerts", confirmDeleteId));
      } catch {}

      // Delete from Firestore (incidentReports)
      try {
        await deleteDoc(doc(firestore, "incidentReports", confirmDeleteId));
      } catch {}

      // Delete from Realtime Database (history)
      try {
        const db = getDatabase();
        const historyRef = ref(
          db,
          `users/${userId}/history/${confirmDeleteId}`
        );
        await remove(historyRef);
      } catch {}

      setConfirmDeleteId(null);

      // Refresh history after deletion
      handleRefresh();
      setLoading(false);
    } catch (error) {
      setConfirmDeleteId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      setRefreshing(false);
      return;
    }
    const db = getDatabase();
    const historyRef = ref(db, `users/${userId}/history`);
    onValue(
      historyRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const arr = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setHistory(arr.reverse());
        setRefreshing(false);
      },
      { onlyOnce: true }
    );
  };

  const handleHistoryPress = (item: any) => {
    router.push({
      pathname: "/(menu-components)/HistoryDetails",
      params: { history: JSON.stringify(item) },
    });
  };

  // --- Swipeable Delete Button ---
  const renderRightActions = (item: any) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => confirmRemoveHistory(item.id)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity onPress={() => handleHistoryPress(item)}>
        <View
          style={[
            styles.card,
            {
              borderLeftColor: serviceColors[item.type] || "#888",
              borderLeftWidth: 6,
            },
          ]}
        >
          <Ionicons
            name={serviceIcons[item.type] || "document"}
            size={28}
            color={serviceColors[item.type] || "#888"}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {item.type === "sos"
                ? "SOS"
                : item.serviceType?.charAt(0).toUpperCase() +
                  item.serviceType?.slice(1)}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={styles.time}>{formatTimestamp(item.time)}</Text>
            {item.reply && (
              <Text style={styles.reply}>
                Reply: {item.reply.message || "Received"}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff5330" />
        <Text>Loading history...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? theme.card : theme.background },
        ]}
      >
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history found.</Text>
          </View>
        ) : (
          <>
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
                  <Text style={styles.modalTitle}>Delete History?</Text>
                  <Text style={styles.modalText}>
                    Are you sure you want to delete this history item?
                  </Text>
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: "#ff5330" }]}
                      onPress={handleDeleteHistory}
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
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ListEmptyComponent={<Text>No history found.</Text>}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingVertical: 18,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: { fontSize: 17, fontWeight: "bold", color: "#222" },
  message: { fontSize: 15, color: "#444", marginTop: 2 },
  time: { fontSize: 13, color: "#888", marginTop: 6 },
  reply: { fontSize: 14, color: "#008000", marginTop: 8, fontWeight: "600" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 22,
    color: "#aaa",
    marginTop: 10,
    fontWeight: "bold",
  },
  emptySubText: {
    fontSize: 15,
    color: "#bbb",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 20,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

function formatTimestamp(ts: any): string {
  if (!ts) return "";
  try {
    if (
      typeof ts === "object" &&
      ts !== null &&
      typeof ts.toDate === "function"
    ) {
      return ts.toDate().toLocaleString();
    }
    if (typeof ts === "object" && ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString();
    }
    if (typeof ts === "string" || typeof ts === "number") {
      const date = new Date(ts);
      return isNaN(date.getTime()) ? String(ts) : date.toLocaleString();
    }
    return String(ts);
  } catch {
    return "";
  }
}
