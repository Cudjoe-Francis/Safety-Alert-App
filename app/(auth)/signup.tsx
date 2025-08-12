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
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
// import { replace } from "expo-router/build/global-state/routing";
import { useRouter } from "expo-router";

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

const SignUp = () => {
  // State variables for form fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // State variables for error messages
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(firestore, "users", user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          email,
          createdAt: new Date().toISOString(),
        });

        // **Save to Realtime Database (add this block)**
        const db = getDatabase();
        await dbSet(dbRef(db, `users/${user.uid}`), {
          firstName,
          lastName,
          email,
        });

        router.replace("/(tabs)");
        console.log("User signed up successfully:", user);
      } catch (error: any) {
        console.error("Signup failed:", error.message);
        setEmailError("Signup failed. " + error.message);
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
          <View style={styles.formContainer}>
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
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) validatePassword(text);
              }}
              onBlur={() => validatePassword(password)}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <Text style={styles.text}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                confirmPasswordError ? styles.inputError : null,
              ]}
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError)
                  validateConfirmPassword(text, password);
              }}
              onBlur={() => validateConfirmPassword(confirmPassword, password)}
            />
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
          </View>
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
    paddingTop: 10,
  },
  inputError: {
    borderColor: "red",
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
    marginBottom: 20,
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
