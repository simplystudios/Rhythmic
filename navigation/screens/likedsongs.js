import React, { useState, useEffect } from 'react';
import storage from "./components/Storage";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SettingsScreen({ route, navigation }) {
  const [likedsonglist, setLikedSonglist] = useState([]);
  const flatListRef = React.useRef();
  const { likedsongs } = route.params || {};

  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('likedsongs');
        if (jsonValue != null) {
          const ret = JSON.parse(jsonValue);
          console.log("Loaded liked songs from storage:", ret);
          setLikedSonglist(ret);
        }
      } catch (err) {
        console.warn(err.message);
      }
    };

    loadLikedSongs();
  }, []);

  useEffect(() => {
    console.log("Updated liked song list:", likedsonglist);
  }, [likedsonglist]);

  return (
    <View style={styles.container}>
    <View>
      <Text style={styles.musictitle}>Liked Songs</Text>
    </View>
     
      <SafeAreaView style={styles.kk}>
        <FlatList
          data={likedsonglist}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Now Playing", {
                      title: item.title,
                      image: item.image,
                      id: item.id,
                      isfromliked: true,
                      artist:item.artist,
                      likedsongsl:likedsonglist,
                    })
                  }
                  style={styles.cardplain}
                >
                  <View style={styles.imageRow}>
                    <Image
                      source={{ uri: `${item.image}` }}
                      resizeMode="cover"
                      style={styles.image}
                    />
                    <View style={styles.textv}>
                      <Text style={styles.musicName}>{item.title}</Text>
                      <Text style={styles.musicName}>by: {item.artist}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  textcolor: {
    color: 'white',
    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#020202",
    alignItems: "center",
    justifyContent: "center",
  },
  cardplain: {
    width: 384,
    backgroundColor: "#161515",
    borderRadius: 10,
    flexDirection: "row",
  },
  slide:{
    WebkitOverflowScrolling:"auto"
  },
  kk:{
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  upname: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: "#706b6b",
    fontSize: 15,
    marginLeft: 16,
    justifyContent: "center",
  },
  image: {
    width: 100,
    borderRadius: 10,
    height: 100,
  },
  musictitle:{
    flex: 1,
    alignItems: "center",
    display: "flex",
    color: "#ffffff",
    fontSize: 30,
    marginLeft: 20,
    textAlign: "center",
    justifyContent: "center",
  },
  musicName: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    color: "#ffffff",
    fontSize: 15,
    marginLeft: 20,
    textAlign: "center",
    justifyContent: "center",
  },
  imageRow: {
    height: 110,
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
    marginLeft: 6,
    marginTop: 5,
  },
  playlists: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
  },
  likedsongs: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#302e35",
    padding: 10,
    width: 300,
    borderRadius: 10,
  },
  textv: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    color: "#ffffff",
    fontSize: 15,
    marginLeft: 20,
    padding:2,
    justifyContent: "center",
  },
  likedcardtxt: {
    flex: 1,
    color: "red",
    fontSize: 15,
  },
  heart: {
    flex: 1,
    marginTop: 6,
  },
  cardtxt: {
    color: "white",
    textAlign: "center",
    padding: 2,
    fontSize: 25,
  },
  search: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "#302e35",
    padding: 10,
    margin: 20,
    borderRadius: 10,
    width: 400,
  },
  cardtxtcontain: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: 5,
    margin: 10,
  },
  card: {
    flex: 1,
    textAlign: "center",
    margin: 10,
    padding: 10,
    alignContent: "center",
    borderRadius: 10,
    backgroundColor: "#161515",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    marginLeft: "auto",
    marginRight: "auto",
    width: 280,
    height: 280,
    margin: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#6546a7",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 45,
  },
  playbutton: {
    backgroundColor: "#6546a7",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 45,
  },
  buttontxt: {
    color: "white",
    textAlign: "center",
  },
  logo: {
    color: "white",
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
  tinput: {
    color: "white",
    padding: 5,
    width: 280,
  },
});
