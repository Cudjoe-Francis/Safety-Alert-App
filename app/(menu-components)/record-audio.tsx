import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import Slider from '@react-native-community/slider';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

type RecordingItem = {
  name: string;
  uri: string;
  date: string;
};

export default function VoiceMemoScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [expandedUri, setExpandedUri] = useState<string | null>(null);

  const recordingsDir = FileSystem.documentDirectory + 'recordings/';

  useEffect(() => {
    FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true }).catch(() => {});
    loadSavedRecordings();
  }, []);

  const loadSavedRecordings = async () => {
    const files = await FileSystem.readDirectoryAsync(recordingsDir);
    const list = files.map((file) => ({
      name: file,
      uri: recordingsDir + file,
      date: new Date(Number(file.split('_')[1].split('.')[0])).toLocaleString(),
    }));
    setRecordings(list.reverse());
  };

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission required', 'Please allow microphone access.');
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const filename = `Recording_${Date.now()}.m4a`;
    const newPath = recordingsDir + filename;

    if (uri) {
      await FileSystem.moveAsync({ from: uri, to: newPath });
      loadSavedRecordings();
    }

    setRecording(null);
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const playSound = async (item: RecordingItem) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const { sound: newSound, status } = await Audio.Sound.createAsync(
      { uri: item.uri },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    setSound(newSound);
    setPlayingUri(item.uri);
    setDuration(status.durationMillis || 1);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.positionMillis != null) {
      setPosition(status.positionMillis);
      if (status.didJustFinish) {
        setPlayingUri(null);
      }
    }
  };

  const deleteRecording = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    loadSavedRecordings();
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={isRecording ? styles.stopButton : styles.recordButton}
        onPress={toggleRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                onPress={() =>
                  setExpandedUri(expandedUri === item.uri ? null : item.uri)
                }
              >
                <AntDesign
                  name={expandedUri === item.uri ? 'up' : 'down'}
                  size={16}
                  color="orangered"
                />
              </TouchableOpacity>

              <Text style={styles.date}>{item.date}</Text>

              <TouchableOpacity onPress={() => deleteRecording(item.uri)}>
                <MaterialIcons name="delete" size={24} color="orangered" />
              </TouchableOpacity>
            </View>

            {expandedUri === item.uri && (
              <View style={styles.audioRow}>
                <TouchableOpacity onPress={() => playSound(item)}>
                  <AntDesign name="play" size={24} color="orangered" />
                </TouchableOpacity>

                <Slider
                  style={{ flex: 1, marginHorizontal: 10 }}
                  value={playingUri === item.uri ? position : 0}
                  minimumValue={0}
                  maximumValue={duration}
                  minimumTrackTintColor="orangered"
                  thumbTintColor="orangered"
                  disabled
                />
                <Text style={styles.time}>
                  {(duration / 1000).toFixed(0).padStart(2, '0')}s
                </Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>No saved recordings.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#fff' },
  recordButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  time: {
    width: 40,
    textAlign: 'right',
    color: '#555',
  },
});
