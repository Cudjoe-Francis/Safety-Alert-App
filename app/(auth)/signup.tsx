// // import { replace } from "expo-router/build/global-state/routing";
// import { StatusBar } from "expo-status-bar";
// import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
// import { ref as dbRef, set as dbSet, getDatabase } from "firebase/database";
// import { getFirestore } from "firebase/firestore";
// import React, { useState } from "react";
// // import { replace } from "expo-router/build/global-state/routing";
// import { useRouter } from "expo-router";

// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// const SignUp = () => {
//   // State variables for form fields
//   const [firstName, setFirstName] = useState<string>("");
//   const [lastName, setLastName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [confirmPassword, setConfirmPassword] = useState<string>("");

//   // State variables for error messages
//   const [firstNameError, setFirstNameError] = useState<string>("");
//   const [lastNameError, setLastNameError] = useState<string>("");
//   const [emailError, setEmailError] = useState<string>("");
//   const [passwordError, setPasswordError] = useState<string>("");
//   const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

//   const router = useRouter();

//   const validateTextInput = (
//     value: string,
//     fieldName: string,
//     setError: React.Dispatch<React.SetStateAction<string>>
//   ): boolean => {
//     if (!value.trim()) {
//       setError(`${fieldName} is required.`);
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) {
//       setEmailError("Email is required.");
//       return false;
//     } else if (!emailRegex.test(email)) {
//       setEmailError("Please enter a valid email address.");
//       return false;
//     }
//     setEmailError("");
//     return true;
//   };

//   const validatePassword = (password: string): boolean => {
//     if (!password) {
//       setPasswordError("Password is required.");
//       return false;
//     } else if (password.length < 6) {
//       setPasswordError("Password must be at least 6 characters long.");
//       return false;
//     }
//     setPasswordError("");
//     return true;
//   };

//   const validateConfirmPassword = (
//     confirmPass: string,
//     originalPass: string
//   ): boolean => {
//     if (!confirmPass) {
//       setConfirmPasswordError("Confirm Password is required.");
//       return false;
//     } else if (confirmPass !== originalPass) {
//       setConfirmPasswordError("Passwords do not match.");
//       return false;
//     }
//     setConfirmPasswordError("");
//     return true;
//   };

//   const auth = getAuth();
//   // const firestore = getFirestore();

//   const handleSignUp = async () => {
//     const isFirstNameValid = validateTextInput(
//       firstName,
//       "First Name",
//       setFirstNameError
//     );
//     const isLastNameValid = validateTextInput(
//       lastName,
//       "Last Name",
//       setLastNameError
//     );
//     const isEmailValid = validateEmail(email);
//     const isPasswordValid = validatePassword(password);
//     const isConfirmPasswordValid = validateConfirmPassword(
//       confirmPassword,
//       password
//     );

//     if (
//       isFirstNameValid &&
//       isLastNameValid &&
//       isEmailValid &&
//       isPasswordValid &&
//       isConfirmPasswordValid
//     ) {
//       try {
//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );
//         const user = userCredential.user;

//         // **Only save to Realtime Database**
//         const db = getDatabase();
//         await dbSet(dbRef(db, `users/${user.uid}`), {
//           firstName,
//           lastName,
//           email,
//         });

//         router.replace("/(tabs)");
//         console.log("User signed up successfully:", user);
//       } catch (error: any) {
//         console.error("Signup failed:", error.message);
//         setEmailError("Signup failed. " + error.message);
//       }
//     } else {
//       console.log("Validation failed.");
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <View style={styles.mainContainer}>
//         <View style={styles.createAcc}>
//           <Text style={styles.createAccText}>Create Your Account</Text>
//         </View>

//         <KeyboardAvoidingView
//           style={{
//             flex: 1,
//             backgroundColor: "#fff",
//             borderTopLeftRadius: 26,
//             borderTopRightRadius: 26,
//           }}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
//         >
//           <View style={styles.formContainer}>
//             <Text style={styles.text}>First Name</Text>
//             <TextInput
//               style={[styles.input, firstNameError ? styles.inputError : null]}
//               value={firstName}
//               onChangeText={(text) => {
//                 setFirstName(text);
//                 if (firstNameError)
//                   validateTextInput(text, "First Name", setFirstNameError);
//               }}
//               onBlur={() =>
//                 validateTextInput(firstName, "First Name", setFirstNameError)
//               }
//             />
//             {firstNameError ? (
//               <Text style={styles.errorText}>{firstNameError}</Text>
//             ) : null}

//             <Text style={styles.text}>Last Name</Text>
//             <TextInput
//               style={[styles.input, lastNameError ? styles.inputError : null]}
//               value={lastName}
//               onChangeText={(text) => {
//                 setLastName(text);
//                 if (lastNameError)
//                   validateTextInput(text, "Last Name", setLastNameError);
//               }}
//               onBlur={() =>
//                 validateTextInput(lastName, "Last Name", setLastNameError)
//               }
//             />
//             {lastNameError ? (
//               <Text style={styles.errorText}>{lastNameError}</Text>
//             ) : null}

//             <Text style={styles.text}>Email</Text>
//             <TextInput
//               style={[styles.input, emailError ? styles.inputError : null]}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={email}
//               onChangeText={(text) => {
//                 setEmail(text);
//                 if (emailError) validateEmail(text);
//               }}
//               onBlur={() => validateEmail(email)}
//             />
//             {emailError ? (
//               <Text style={styles.errorText}>{emailError}</Text>
//             ) : null}

//             <Text style={styles.text}>Password</Text>
//             <TextInput
//               style={[styles.input, passwordError ? styles.inputError : null]}
//               secureTextEntry
//               value={password}
//               onChangeText={(text) => {
//                 setPassword(text);
//                 if (passwordError) validatePassword(text);
//               }}
//               onBlur={() => validatePassword(password)}
//             />
//             {passwordError ? (
//               <Text style={styles.errorText}>{passwordError}</Text>
//             ) : null}

//             <Text style={styles.text}>Confirm Password</Text>
//             <TextInput
//               style={[
//                 styles.input,
//                 confirmPasswordError ? styles.inputError : null,
//               ]}
//               secureTextEntry
//               value={confirmPassword}
//               onChangeText={(text) => {
//                 setConfirmPassword(text);
//                 if (confirmPasswordError)
//                   validateConfirmPassword(text, password);
//               }}
//               onBlur={() => validateConfirmPassword(confirmPassword, password)}
//             />
//             {confirmPasswordError ? (
//               <Text style={styles.errorText}>{confirmPasswordError}</Text>
//             ) : null}

//             <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
//               <Text style={styles.btnText}>SIGN UP</Text>
//             </TouchableOpacity>

//             <View style={styles.signInContainer}>
//               <Text>Already have an account?</Text>
//               <TouchableOpacity onPress={() => router.replace("/signin")}>
//                 <Text style={styles.signInText}>Sign In</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//         <StatusBar style="light" />
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default SignUp;

// const styles = StyleSheet.create({
//   mainContainer: {
//     backgroundColor: "#ff5330",
//     flex: 1,
//   },

//   createAcc: {
//     paddingHorizontal: 20,
//     paddingVertical: 60,
//   },

//   createAccText: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//     width: 150,
//   },

//   formContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 26,
//     borderTopRightRadius: 26,
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//     borderRightColor: "#fff",
//   },

//   text: {
//     color: "#000",
//   },

//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 28,
//     fontSize: 20,
//     borderColor: "#949494",
//     paddingTop: 10,
//   },
//   inputError: {
//     borderColor: "red",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginTop: -20,
//     marginBottom: 10,
//   },

//   signInContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//   },

//   signUpBtn: {
//     backgroundColor: "#ff5330",
//     borderRadius: 20,
//     marginTop: 30,
//     paddingVertical: 10,
//     width: 340,
//     alignSelf: "center",
//     marginBottom: 20,
//   },

//   btnText: {
//     textAlign: "center",
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   signInText: {
//     color: "#ff5330",
//     marginLeft: 12,
//   },
// });

// import { replace } from "expo-router/build/global-state/routing";

import { StatusBar } from "expo-status-bar";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { ref as dbRef, set as dbSet, getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { validateEmailRegistration } from "../../services/userValidationService";

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {
  // State variables for form fields
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [homeAddress, setHomeAddress] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [bloodType, setBloodType] = useState<string>("");
  const [medicalCondition, setMedicalCondition] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // State variables for error messages
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");

  const router = useRouter();

  const validateTextInput = (
    value: string,
    fieldName: string,
    setError: React.Dispatch<React.SetStateAction<string>>
  ): boolean => {
    if (!value.trim()) {
      setError(`${fieldName} is required.`);
      return false;
    }
    setError("");
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required.");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (
    confirmPass: string,
    originalPass: string
  ): boolean => {
    if (!confirmPass) {
      setConfirmPasswordError("Confirm Password is required.");
      return false;
    } else if (confirmPass !== originalPass) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const auth = getAuth();
  const firestore = getFirestore();

  const handleSignUp = async () => {
    const isFirstNameValid = validateTextInput(
      firstName,
      "First Name",
      setFirstNameError
    );
    const isLastNameValid = validateTextInput(
      lastName,
      "Last Name",
      setLastNameError
    );
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
      confirmPassword,
      password
    );

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      try {
        // Validate email registration before creating account
        const validation = await validateEmailRegistration(
          email,
          'mobile',
          'mobile_app'
        );
        
        if (!validation.isValid) {
          console.log('❌ Validation failed:', validation.message);
          setAuthError(validation.message);
          return;
        }
        
        console.log('✅ Validation passed:', validation.message);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(firestore, "users", user.uid), {
          uid: user.uid,
          firstName,
          middleName,
          lastName,
          email: email.toLowerCase().trim(),
          phoneNumber,
          homeAddress,
          occupation,
          gender,
          dateOfBirth,
          bloodType,
          medicalCondition,
          allergies,
          userType: 'mobile',
          platform: 'mobile_app',
          serviceType: 'mobile', // Mobile users have serviceType 'mobile'
          createdAt: serverTimestamp(),
        });

        // **Save to Realtime Database (add this block)**
        const db = getDatabase();
        await dbSet(dbRef(db, `users/${user.uid}`), {
          firstName,
          middleName,
          lastName,
          email: email.toLowerCase().trim(),
          phoneNumber,
          homeAddress,
          occupation,
          gender,
          dateOfBirth,
          bloodType,
          medicalCondition,
          allergies,
          userType: 'mobile',
          platform: 'mobile_app',
        });

        router.replace("/(tabs)");
        console.log("Mobile user signed up successfully:", user);
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          alert("Email has already been used. Please sign in.");
        } else {
          alert("Signup failed. " + error.message);
        }
      }
    } else {
      console.log("Validation failed.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        <View style={styles.createAcc}>
          <Text style={styles.createAccText}>Create Your Account</Text>
        </View>

        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        >
          <ScrollView style={styles.formContainer}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={[styles.input, firstNameError ? styles.inputError : null]}
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (firstNameError)
                  validateTextInput(text, "First Name", setFirstNameError);
              }}
              onBlur={() =>
                validateTextInput(firstName, "First Name", setFirstNameError)
              }
            />
            {firstNameError ? (
              <Text style={styles.errorText}>{firstNameError}</Text>
            ) : null}

            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={[styles.input, lastNameError ? styles.inputError : null]}
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (lastNameError)
                  validateTextInput(text, "Last Name", setLastNameError);
              }}
              onBlur={() =>
                validateTextInput(lastName, "Last Name", setLastNameError)
              }
            />
            {lastNameError ? (
              <Text style={styles.errorText}>{lastNameError}</Text>
            ) : null}

            <Text style={styles.text}>Middle Name (Optional)</Text>
            <TextInput
              style={styles.input}
              value={middleName}
              onChangeText={setMiddleName}
            />

            <Text style={styles.text}>Phone Number</Text>
            <TextInput
              style={[styles.input, phoneNumberError ? styles.inputError : null]}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (phoneNumberError)
                  validateTextInput(text, "Phone Number", setPhoneNumberError);
              }}
              onBlur={() =>
                validateTextInput(phoneNumber, "Phone Number", setPhoneNumberError)
              }
            />
            {phoneNumberError ? (
              <Text style={styles.errorText}>{phoneNumberError}</Text>
            ) : null}

            <Text style={styles.text}>Home Address</Text>
            <TextInput
              style={styles.input}
              value={homeAddress}
              onChangeText={setHomeAddress}
              multiline
            />

            <Text style={styles.text}>Occupation</Text>
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
            />

            <Text style={styles.text}>Gender</Text>
            <TextInput
              style={styles.input}
              value={gender}
              onChangeText={setGender}
              placeholder="Male/Female/Other"
            />

            <Text style={styles.text}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.text}>Blood Type (Optional)</Text>
            <TextInput
              style={styles.input}
              value={bloodType}
              onChangeText={setBloodType}
              placeholder="A+, B-, O+, etc."
            />

            <Text style={styles.text}>Medical Condition (Optional)</Text>
            <TextInput
              style={styles.input}
              value={medicalCondition}
              onChangeText={setMedicalCondition}
              multiline
            />

            <Text style={styles.text}>Allergies (Optional)</Text>
            <TextInput
              style={styles.input}
              value={allergies}
              onChangeText={setAllergies}
              multiline
            />

            <Text style={styles.text}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <Text style={styles.text}>Password</Text>

            <View
              style={[
                styles.passwordContainer,
                passwordError ? styles.inputError : null,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                  setAuthError("");
                }}
                onBlur={() => validatePassword(password)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                // style={{ padding: 5 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={28}
                  color="#555"
                  // style={{ marginRight: 0 }}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <Text style={styles.text}>Confirm Password</Text>


            <View
              style={[
                styles.passwordContainer,
                passwordError ? styles.inputError : null,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  confirmPasswordError ? styles.inputError : null,
                ]}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError)
                    validateConfirmPassword(text, password);
                }}
                onBlur={() =>
                  validateConfirmPassword(confirmPassword, password)
                }
              />

              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                // style={{ padding: 5 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={28}
                  color="#555"
                  // style={{ marginRight: 0 }}
                />
              </TouchableOpacity>
            </View>

            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}

            <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
              <Text style={styles.btnText}>SIGN UP</Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/signin")}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <StatusBar style="light" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#ff5330",
    flex: 1,
  },

  createAcc: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },

  createAccText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    width: 150,
  },

  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRightColor: "#fff",
  },

  text: {
    color: "#000",
  },

  input: {
    borderBottomWidth: 1,
    marginBottom: 28,
    fontSize: 20,
    borderColor: "#949494",
    paddingVertical: Platform.OS === "ios" ? 6 : 4,
  },

  inputError: {
    borderColor: "red",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#949494",
    marginBottom: 28,
    paddingBottom: 2,
  },

  passwordInput: {
    flex: 1,
    fontSize: 20,
    paddingVertical: Platform.OS === "ios" ? 6 : 4,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -20,
    marginBottom: 10,
  },

  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  signUpBtn: {
    backgroundColor: "#ff5330",
    borderRadius: 20,
    marginTop: 30,
    paddingVertical: 10,
    width: 340,
    alignSelf: "center",
    marginBottom: 40,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  signInText: {
    color: "#ff5330",
    marginLeft: 12,
  },
});
