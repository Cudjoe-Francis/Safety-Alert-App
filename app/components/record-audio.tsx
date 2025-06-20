import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

const RecordAudio = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.back_icon_ctn}>
          <Pressable onPress={() => router.back()} style={styles.back_icon}>
            <Entypo name="chevron-left" size={28} color="#FF5330" />
          </Pressable>

          <View style={styles.info_icon_ctn}>
            <Pressable
              style={{ flexDirection: "row" }}
              onPress={() => alert("Find help button pressed!")}
            >
              <Ionicons
                name="information-circle-outline"
                size={28}
                color="#000"
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RecordAudio;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  back_icon_ctn: {
    paddingHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
  },

  back_icon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    height: 40,
  },

  info_icon_ctn: {
    flexDirection: "row",
    alignItems: "center",
  },
});
