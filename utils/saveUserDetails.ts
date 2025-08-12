import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

export async function saveUserDetails(details: any, profileImageUri?: string) {
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated.");

  let profileImageUrl = details.profileImageUrl || "";

  // Upload profile image if changed and not default
  if (profileImageUri && !profileImageUri.startsWith("http")) {
    const extension = getFileExtension(profileImageUri);
    const imgRef = storageRef(storage, `profileImages/${user.uid}${extension}`);
    const response = await fetch(profileImageUri);
    const blob = await response.blob();

    // Detect MIME type based on file extension
    let mimeType = "image/jpeg";
    if (extension === ".png") mimeType = "image/png";
    else if (extension === ".jpg" || extension === ".jpeg")
      mimeType = "image/jpeg";
    else if (extension === ".webp") mimeType = "image/webp";
    else if (extension === ".gif") mimeType = "image/gif";

    await uploadBytes(imgRef, blob, { contentType: mimeType });
    profileImageUrl = await getDownloadURL(imgRef);
  }

  // Save details to Realtime Database
  await set(ref(db, `users/${user.uid}`), {
    ...details,
    profileImageUrl,
  });

  return profileImageUrl;
}

// Helper function to get file extension from URI
function getFileExtension(uri: string) {
  const match = uri.match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0].toLowerCase() : ".jpg";
}
