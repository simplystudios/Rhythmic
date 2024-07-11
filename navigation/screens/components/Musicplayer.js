import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import TrackPlayer, { useTrackPlayerProgress } from "react-native-track-player";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Slider } from "@react-native-assets/slider";

export default function AudioPlayer({ title, image, id }) {
  const [icon, setIcon] = useState("play");
  const [playing, setPlaying] = useState(false);
  const { position, duration } = useTrackPlayerProgress(250);

  useEffect(() => {
    setupAudio();
  }, [id]);

  const setupAudio = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id,
        url: `https://musicapi.x007.workers.dev/fetch?id=${id}`,
        title,
        artwork: image,
      });
    } catch (error) {
      console.log("Error setting up audio:", error);
    }
  };

  const startAudio = async () => {
    try {
      if (playing) {
        await TrackPlayer.pause();
        setPlaying(false);
        setIcon("play-outline");
      } else {
        await TrackPlayer.play();
        setPlaying(true);
        setIcon("pause");
      }
    } catch (error) {
      console.log("Error starting audio:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.playbox}>
        <Image
          resizeMode="contain"
          style={styles.music}
          source={{ uri: image }}
        />
        <View style={styles.title}>
          <Text style={styles.textcolor}>{title}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#8E8787"
          thumbTintColor={"purple"}
          marginBottom={10}
        />
        <View style={styles.playerlay}>
          <Pressable style={styles.player} onPress={startAudio}>
            <Ionicons name={icon} size={32} color="#ffffff" />
          </Pressable>
        </View>
      </View>
      <View style={styles.id}>
        <Text style={styles.idtxt}>Song ID: {id}</Text>
        <Text style={styles.idtxt}>Position: {Math.floor(position)} ms</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#090909",
    alignContent: "center",
  },
  title: {
    margin: 5,
    padding: 10,
  },
  id: {
    alignSelf: "flex-start",
    textAlign: "bottom-left",
  },
  playerlay: {
    flexDirection: "row",
    justifyContent: "center",
  },
  player: {
    margin: 5,
    backgroundColor: "#393639",
    padding: 10,
    borderRadius: 80,
  },
  playbox: {
    flex: 1,
    padding: 10,
    backgroundColor: "#090909",
    alignItems: "center",
    justifyContent: "center",
  },
  textcolor: {
    color: "white",
    fontSize: 30,
    marginBottom: 10,
    marginTop: 10,
  },
  idtxt: {
    color: "#8e8787",
    fontSize: 10,
  },
  music: {
    width: "100%",
    height: 300,
    margin: 5,
    shadowOffset: 10,
    shadowColor: "grey",
  },
  slider: {
    width: "100%",
    height: 50,
    marginBottom: 50,
  },
});
