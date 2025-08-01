import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback} from "react";
import { FlatList, StyleSheet, Text, View ,
    NativeScrollEvent,
  NativeSyntheticEvent,

} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../themeContext";

type HistoryItem = {
  id: string;
  type: string;
  timestamp: string;
  location: string;
  audioUrl?: string;
};

const mockHistory: HistoryItem[] = [
  // Example data, replace with real data from Firestore
  // {
  //   id: '1',
  //   type: 'SOS Alert',
  //   timestamp: '2025-07-31 14:22',
  //   location: 'Accra, Ghana',
  //   audioUrl: 'https://example.com/audio.mp3',
  // },
];

const History = () => {
  const [history] = useState<HistoryItem[]>(mockHistory);

  
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

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <Text style={styles.location}>{item.location}</Text>
      {item.audioUrl && (
        <View style={styles.audioRow}>
          <Ionicons name="play-circle-outline" size={24} color="#ff5330" />
          <Text style={styles.audioText}>Listen to audio</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container  , { backgroundColor: isDarkMode? theme.card : theme.background
 }]}>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No history yet</Text>
          <Text style={styles.emptySubText}>
            Your emergency alerts and reports will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  type: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5330",
  },
  timestamp: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  location: {
    fontSize: 16,
    marginTop: 4,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  audioText: {
    marginLeft: 8,
    color: "#ff5330",
    fontSize: 15,
  },
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
});
