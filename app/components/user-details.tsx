import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "..//../themeContext";

interface UserDetailsModalProps {
  closeModal: () => void;
}

// Placeholder for a local image asset (replace with your actual path if needed)
const defaultProfilePictureUri =
  "https://placehold.co/60x60/ff5330/ffffff?text=PP";

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ closeModal }) => {
  const { isDarkMode, theme } = useTheme();

  // State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State to manage loading state for image picking
  const [isPickingImage, setIsPickingImage] = useState(false);

  // State to store user details
  const [userDetails, setUserDetails] = useState({
    name: "Francis Cudjoe",
    occupation: "Student",
    phone: "0256782612",
    email: "cudjoefrancis1225@gmail.com",
    address: "AK-0247-9459",
    gender: "Male",
    dob: "24 June 2008",
    bloodType: "O",
    medicalCondition: "Asthma",
    allergies: "None",
  });

  // State for the profile picture source (using URI for network or base64)
  const [profileImageSrc, setProfileImageSrc] = useState<string>(
    defaultProfilePictureUri
  );

  // Temporary state to hold changes during edit mode before saving
  const [tempDetails, setTempDetails] = useState(userDetails);
  const [tempProfileImageSrc, setTempProfileImageSrc] =
    useState(profileImageSrc);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        // ImagePicker is primarily for native platforms
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "We need camera roll permissions to make this work! Please enable it in your device settings.",
            [{ text: "OK" }]
          );
        }
      }
    })();
  }, []);

  // Function to handle toggling between view and edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // If currently editing, save the temporary changes
      setUserDetails(tempDetails);
      setProfileImageSrc(tempProfileImageSrc);
    } else {
      // If not editing, copy current details to temporary state for editing
      setTempDetails(userDetails);
      setTempProfileImageSrc(profileImageSrc);
    }
    // Toggle the editing state
    setIsEditing(!isEditing);
  };

  // Function to handle changes in editable input fields
  const handleFieldChange = (
    field: keyof typeof userDetails,
    value: string
  ) => {
    setTempDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Function to handle profile picture selection using expo-image-picker
  const handleProfilePictureClick = async () => {
    if (isEditing) {
      setIsPickingImage(true); // Set loading state
      try {
        // Permissions are requested on mount, but we can re-check here if needed
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Sorry, we need camera roll permissions to make this work! Please enable it in your device settings.",
            [{ text: "OK" }]
          );
          return;
        }

        // Launch image library to pick an image
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true, // Enable cropping
          aspect: [1, 1], // Crop to a square aspect ratio
          quality: 1,
        });

        console.log("ImagePicker Result:", result); // Log the result for debugging

        if (!result.canceled && result.assets && result.assets.length > 0) {
          // Update the temporary profile image source with the selected image URI
          setTempProfileImageSrc(result.assets[0].uri);
        } else if (result.canceled) {
          console.log("Image picking cancelled.");
        } else {
          console.log("No assets found in the result.");
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image. Please try again.");
      } finally {
        setIsPickingImage(false); // Reset loading state
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? theme.background : theme.card },
      ]}
    >
      {/* Top Container with Close and Edit/Done Buttons */}
      <View
        style={[
          styles.topContainer,
          {
            backgroundColor: isDarkMode ? theme.card : theme.background,
            borderBlockColor: isDarkMode ? "grey" : "#eee",
          },
        ]}
      >
        <Pressable onPress={closeModal}>
          <Entypo name="chevron-down" size={30} color="#ff5330" />
        </Pressable>
        <Pressable onPress={handleEditToggle}>
          {isEditing ? (
            <Entypo name="check" size={24} color="#ff5330" />
          ) : (
            <Entypo name="edit" size={20} color="#ff5330" />
          )}
        </Pressable>
      </View>

      {/* Profile Details Container */}
      <View
        style={[
          styles.profileContainer,
          { backgroundColor: isDarkMode ? theme.card : theme.background },
        ]}
      >
        {/* Profile Image and Name/Occupation */}
        <View style={styles.profileImageContainer}>
          <Pressable
            onPress={handleProfilePictureClick}
            style={styles.profileImagePressable}
          >
            <Image
              source={{
                uri: isEditing ? tempProfileImageSrc : profileImageSrc,
              }}
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.changeOverlay}>
                {isPickingImage ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.changeText}>Change</Text>
                )}
              </View>
            )}
          </Pressable>
          <View style={styles.name_occupation_ctn}>
            <Text
              style={[styles.nameText, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              {userDetails.name}
            </Text>
            <Text
              style={[
                styles.occupationText,
                { color: isDarkMode ? "#fff" : "grey" },
              ]}
            >
              {userDetails.occupation}
            </Text>
          </View>
        </View>

        {/* User Details List */}
        <View style={styles.detailsList}>
          {/* Phone Number */}
          <View style={styles.detailRow}>
            <Text
              style={[
                [styles.detailsQue],
                { color: isDarkMode ? "#ddd" : "grey" },
              ]}
            >
              Phone No
            </Text>
            {isEditing ? (
              <TextInput
                style={styles.detailsInput}
                value={tempDetails.phone}
                onChangeText={(text) => handleFieldChange("phone", text)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text
                style={[
                  styles.detailsAns,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {userDetails.phone}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailsQue,
                { color: isDarkMode ? "#ddd" : "grey" },
              ]}
            >
              Email
            </Text>
            <Text
              style={[
                styles.detailsAns,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {userDetails.email}
            </Text>
          </View>

          {/* Home Address */}
          <View style={styles.detailRow}>
            <Text
              style={[
                [styles.detailsQue, { color: isDarkMode ? "#ddd" : "grey" }],
              ]}
            >
              Home Address
            </Text>
            {isEditing ? (
              <TextInput
                style={styles.detailsInput}
                value={tempDetails.address}
                onChangeText={(text) => handleFieldChange("address", text)}
              />
            ) : (
              <Text
                style={[
                  styles.detailsAns,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {userDetails.address}
              </Text>
            )}
          </View>

          {/* Gender */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailsQue,
                { color: isDarkMode ? "#ddd" : "grey" },
              ]}
            >
              Gender
            </Text>
            <Text
              style={[
                styles.detailsAns,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {userDetails.gender}
            </Text>
          </View>

          {/* Date of Birth */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailsQue,
                { color: isDarkMode ? "#ddd" : "grey" },
              ]}
            >
              Date of Birth
            </Text>
            <Text
              style={[
                styles.detailsAns,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {userDetails.dob}
            </Text>
          </View>

          {/* Blood Type */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailsQue,
                { color: isDarkMode ? "#ddd" : "grey" },
              ]}
            >
              Blood Type
            </Text>
            <Text
              style={[
                styles.detailsAns,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {userDetails.bloodType}
            </Text>
          </View>

          {/* Medical Condition */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailsQue,
                { color: isDarkMode ? "#ddd" : "grey" },
              ]}
            >
              Medical Condition
            </Text>
            {isEditing ? (
              <TextInput
                style={styles.detailsInput}
                value={tempDetails.medicalCondition}
                onChangeText={(text) =>
                  handleFieldChange("medicalCondition", text)
                }
              />
            ) : (
              <Text
                style={[
                  styles.detailsAns,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {userDetails.medicalCondition}
              </Text>
            )}
          </View>

          {/* Allergies */}
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailsQue,
                { color: isDarkMode ? "#ddd" : "grey" },
              ]}
            >
              Allergies
            </Text>
            {isEditing ? (
              <TextInput
                style={styles.detailsInput}
                value={tempDetails.allergies}
                onChangeText={(text) => handleFieldChange("allergies", text)}
              />
            ) : (
              <Text
                style={[
                  styles.detailsAns,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {userDetails.allergies}
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserDetailsModal;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    // backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImageContainer: {
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  profileImagePressable: {
    position: "relative",
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  changeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  name_occupation_ctn: {
    flexDirection: "column",
    rowGap: 5,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  occupationText: {
    fontSize: 16,
    color: "grey",
  },
  detailsList: {
    paddingBottom: 20,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailsQue: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailsAns: {
    fontSize: 20,
  },
  detailsInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#333",
    backgroundColor: "#fefefe",
  },
});
