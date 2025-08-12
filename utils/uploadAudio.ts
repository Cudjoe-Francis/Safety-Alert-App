import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseFirestore";

// Uploads audio file from Expo's recording URI
export async function uploadAudioAsync(
  uri: string,
  userId: string
): Promise<string> {
  // Fetch the file as a blob
  const response = await fetch(uri);
  const blob = await response.blob();

  const audioRef = ref(storage, `alerts/${userId}/${Date.now()}.m4a`);
  await uploadBytes(audioRef, blob, { contentType: "audio/m4a" });
  const downloadUrl = await getDownloadURL(audioRef);
  return downloadUrl;
}
