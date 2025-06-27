import { StyleSheet, Text, Pressable, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";

const profilePicture = require("../../assets/images/profile_picture.jpeg");

const UserDetailsModal = ({ closeModal }: any) => {
  return (
    <SafeAreaView>
      <View style={styles.topContainer}>
        <Pressable onPress={closeModal}>
          <Entypo name="chevron-down" size={30} color="#ff5330" />
        </Pressable>
        <Pressable>
          <Entypo name="edit" size={20} color="#ff5330" />
        </Pressable>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={profilePicture} style={styles.profileImage} />
          <View style={styles.name_occupation_ctn}>
            <Text style={styles.nameText}>Francis Cudjoe</Text>
            <Text style={styles.occupationText}>Student</Text>
          </View>
        </View>

        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Phone No</Text>
          <Text style={styles.detailsAns}>0256782612</Text>
        </View>

        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Email</Text>
          <Text style={styles.detailsAns}>cudjoefrancis1225@gmail.com</Text>
        </View>

        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Home Address</Text>
          <Text style={styles.detailsAns}>AK-0247-9459</Text>
        </View>


        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Gender</Text>
          <Text style={styles.detailsAns}>Male</Text>
        </View>

        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Date of Birth</Text>
          <Text style={styles.detailsAns}>24 June 2008</Text>
        </View>

        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Blood Type</Text>
          <Text style={styles.detailsAns}>O</Text>
        </View>
        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Medical Condition</Text>
          <Text style={styles.detailsAns}>Asthma</Text>
        </View>
        <View style={styles.tell_email_ctn}>
          <Text style={styles.detailsQue}>Allergies</Text>
          <Text style={styles.detailsAns}>None</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserDetailsModal;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },

  bottomContainer: {},

  detailsHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  profileContainer: {
    paddingHorizontal: 20,
  },

  profileImageContainer: {
    flexDirection: "row",
    marginTop: 20,
    columnGap: 20,
    alignItems: "center",
    marginBottom: 30,
  },

  name_occupation_ctn: {
    flexDirection: "column",
    rowGap: 10,
    justifyContent: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },

  nameText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  occupationText: {
    fontSize: 18,
    color: "grey",
  },

  tell_email_ctn: {
    marginBottom: 20,
  },

  detailsAns: {
    fontSize: 18,
  },

  detailsQue: {
    fontSize: 14,
    color: "grey",
  },
});
