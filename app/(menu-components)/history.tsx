import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { firestore } from "../../firebaseConfig";
import { useTheme } from "../../themeContext";
import { getUserHistory } from "../../utils/getUserHistory";

const serviceColors: Record<string, string> = {
  police: "#121a68",
  hospital: "#008000",
  fire: "red",
  campus: "#5d3fd3",
  incident: "#ff5330",
};

const serviceIcons: Record<string, any> = {
  police: "shield",
  hospital: "medkit",
  fire: "flame",
  campus: "school",
  incident: "alert-circle",
};

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const userAlerts = await getUserHistory(); // Alerts
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      let incidentReports: any[] = [];
      if (userId) {
        const incidentQuery = query(
          collection(firestore, "incidentReports"),
          where("userId", "==", userId)
        );
        const incidentSnapshot = await getDocs(incidentQuery);
        incidentReports = incidentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          type: "incident",
        }));
      }
      // Combine and sort by time (latest first)
      const allHistory = [
        ...userAlerts.map((h) => ({ ...h, type: h.serviceType })),
        ...incidentReports,
      ].sort((a, b) => b.time?.seconds - a.time?.seconds);
      setHistory(allHistory);
      setLoading(false);
    }
    fetchHistory();
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

  const handleDeleteHistory = async (alertId: string) => {
    try {
      // Delete all replies under this alert
      const repliesRef = collection(firestore, "alerts", alertId, "replies");
      const repliesSnapshot = await getDocs(repliesRef);
      for (const replyDoc of repliesSnapshot.docs) {
        await deleteDoc(
          doc(firestore, "alerts", alertId, "replies", replyDoc.id)
        );
      }
      // Delete the alert itself
      await deleteDoc(doc(firestore, "alerts", alertId));
      // Remove from local state
      setHistory((prev) => prev.filter((item) => item.id !== alertId));
    } catch (error) {
      console.error("Failed to delete alert from Firestore:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
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
          {item.type === "incident"
            ? "Incident Report"
            : item.serviceType?.charAt(0).toUpperCase() +
              item.serviceType?.slice(1)}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>
          {item.time ? new Date(item.time.seconds * 1000).toLocaleString() : ""}
        </Text>
        {item.reply && (
          <Text style={styles.reply}>
            Reply: {item.reply.message || "Received"}
          </Text>
        )}
      </View>
      {/* Optionally, add a button to view full details */}
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? theme.card : theme.background },
        ]}
      >
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            onScroll={handleScroll}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingTop: 18 },
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
});
