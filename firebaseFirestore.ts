// Re-export from main firebaseConfig to avoid duplicate app initialization
export { firestore } from "./firebaseConfig";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

// Initialize storage with a separate app instance
const storageApp = initializeApp(firebaseConfig, "storage-app");
export const storage = getStorage(storageApp);
