import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Slider } from "@sharcoux/slider";
import * as FileSystem from 'expo-file-system';
import { SelectList } from 'react-native-dropdown-select-list'
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function ShazamScreen({ route, navigation }) {
  const { title = "", image = "", id = "", isfromliked="",likesongsl="",artist="" } = route.params || {};
  const Likedsong = async (title, image, id, artist) => {
  try {
    const storedLikedSongs = await AsyncStorage.getItem('likedsongs');

    let likedSongsArray = []; 

    // 1. If data exists, parse it (might be an object or an array)
    if (storedLikedSongs) {
      try {
        likedSongsArray = JSON.parse(storedLikedSongs);

        // 2. If it's a single object, convert it to an array
        if (!Array.isArray(likedSongsArray)) {
          likedSongsArray = [likedSongsArray]; 
        }
      } catch (error) {
        // If parsing fails (invalid JSON), treat it as an empty array
        likedSongsArray = [];
      }
    }

    // 3. Create the new song object
    const newsong = {
      title: title,
      image: image,
      id: id,
      artist:artist,
    };

    // 4. Add the new song to the array
    likedSongsArray.push(newsong);

    // 5. Save the updated liked songs array to AsyncStorage
    await AsyncStorage.setItem('likedsongs', JSON.stringify(likedSongsArray));

    console.log("Liked song added successfully");

  } catch (error) {
    console.warn('Error adding liked song:', error);
  }
};

const Removelikedsong = async (title, image, id) => {
  try {
    const storedLikedSongs = await AsyncStorage.getItem('likedsongs');

    let likedSongsArray = []; 

    // 1. If data exists, parse it (might be an object or an array)
    if (storedLikedSongs) {
      try {
        likedSongsArray = JSON.parse(storedLikedSongs);

        // 2. If it's a single object, convert it to an array
        if (!Array.isArray(likedSongsArray)) {
          likedSongsArray = [likedSongsArray]; 
        }
      } catch (error) {
        // If parsing fails (invalid JSON), treat it as an empty array
        likedSongsArray = [];
      }
    }

    // 3. Create the new song object
    const newsong = {
      title: title,
      image: image,
      id: id,
    };

    // 4. Add the new song to the array
    likedSongsArray.push(newsong);

    // 5. Save the updated liked songs array to AsyncStorage
    await AsyncStorage.setItem('likedsongs', JSON.stringify(likedSongsArray));

    console.log("Liked song added successfully");

  } catch (error) {
    console.warn('Error adding liked song:', error);
  }
};
  
  const [listen,Setlisten]=useState();
  console.log(isfromliked)
  const [icon, setIcon] = useState("play");
  const [playing, setPlaying] = useState(false);
  const [songnum, setSongnum] = useState(0);
  const [sound, setSound] = useState();
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [fdata, setFdata] = useState()
  const [selected, setSelected] = React.useState("");
  const idurl = id.replace("/watch?v=","")
  const baseurl = "https://pipedapi.in.projectsegfau.lt"
  const [channelid,Setchannelid] =  useState();
  const [lyrics,setLyrics]= useState();
  console.log(idurl)
  // const audiourl = `https://pipedapi.kavin.rocks/streams/${idurl}`;


  useEffect(() => {
    let url = `${baseurl}/streams/${idurl}`;
    async function fetchData(url) {
      try {
        let result = await fetch(url);
        result = await result.json();
        let x =-1
        const formattedData = result.audioStreams.map((item) => ({
        // Extract the property you want to display in the dropdown
        key:x+1,
        value: item.quality,
        
      })); // A
        setFdata(formattedData)
        setData(result.audioStreams[3]);
        Setlisten(result.audioStreams[3].url);
        let upurl = result.uploaderUrl;
        upurl = upurl.replace("/channel/",)
        Setchannelid(upurl)
        console.log(result.audioStreams[0].url);
        try{
          let dd = await fetch(`https://lyrist.vercel.app/api/${title}/${artist}`)
          dd = await dd.json()
          setLyrics(dd.lyrics);
        }
        catch(error){

        }
      } catch (error) {
        console.error("Error fetching the audio streams:", error);
      }
    }
    fetchData(url);
  }, [idurl]);


  async function fetchsongsbyartist() {
      let url = `${baseurl}/channel/${channelid}`;
      try {
        let result = await fetch(url);
        result = await result.json();
        fetchData(result.relatedStreams[songnum]);
      } catch (error) {
        console.error("Error fetching the audio streams:", error);
      }
    }

  const [vol, setVol] = useState(0.1);
  const [data,setData]=useState([]);
  const dailogstuff = () => {
    alert("coming soon");
  };



  async function playfromliked() {
    console.log(likesongsl);
  }


 useEffect(() => {
    const startAudio = async () => {
      if (!id || !data?.url) {
        return;
      }

      setIcon("pause");

      if (sound) {
        await sound.unloadAsync();
      }

      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: data.url },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        volup(0.2);
        setSound(newSound);
        setPlaying(true);
      } catch (error) {
        console.error("Error creating sound instance:", error);
      }
    };

    startAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id, data]);

  const startAudio = async () => {
    if (!id || !data?.url) {
      return;
    }

    if (playing) {
      await sound.pauseAsync();
      setPlaying(false);
      setIcon("play-outline");
    } else {
      setIcon("pause");

      if (sound) {
        await sound.unloadAsync();
      }

      try {
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: data.url },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
        setPlaying(true);
        setPositionMillis(status?.positionMillis || 0);
        setDurationMillis(status?.durationMillis || 0);
      } catch (error) {
        console.error("Error creating sound instance:", error);
      }
    }
  };

  const volup = async (value) => {
    setVol(value.toFixed(1));
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };
  const handleDownload = async (url, title) => {
    console.log("working")
  try {
    console.log("doing")
    const { status } = await MedianLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access media library is required to download the file.');
      return;
    }

    const fileUri = FileSystem.documentDirectory + `${uuidv4()}-${title}.mp3`;

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Download progress: ${progress * 100}%`);
      }
    );

    const { uri } = await downloadResumable.downloadAsync();

    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync('Download');
    if (album == null) {
      await MediaLibrary.createAlbumAsync('Download', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    Alert.alert('Download complete', `File has been saved to ${uri}`);
  } catch (error) {
    console.error(error);
    Alert.alert('Download failed', 'An error occurred while downloading the file.');
  }
};

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && status.isPlaying) {
      setPositionMillis(status.positionMillis);
      setDurationMillis(status.durationMillis);
    }
    if (status.didJustFinish && !status.isLooping) {
      if(isfromliked === true){

      }
      else{
        setPlaying(false);
        setIcon("play-outline");
        setSongnum(songnum+1)
        fetchsongsbyartist();
        // setIsEnded(true);  // The song has ended
        console.log('songended')
      }
      }
  };


  
  return (
    
    <ScrollView style={styles.container}>
      <View style={styles.playbox}>
        {image ? (
          <Image
            resizeMode="cover"
            style={styles.music}
            source={{ uri: image }}
          />
          
        ) : (
          <Image
            resizeMode="contain"
            style={styles.music}
            source={require("./images/icon.png")} // Replace with your own placeholder image
          />
        )}
        <View style={styles.title}>
          {title ? (
            <Text style={styles.textcolor}>{title}</Text>
          ) : (
            <View style={styles.title}>
              <Text style={styles.textcolor}>
                No Title Available Play A Song First
              </Text>
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={styles.btn}
              >
                <Text style={styles.btn2txt}>Go Back To Home</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.right1}>
        <Text>Audio Quality:- </Text>
      <SelectList 
        setSelected={(val) => setSelected(val)} 
        data={fdata} 
        defaultOption={{value:`data.quality` }}
        searchicon={<Ionicons name="search" size={14} color="#ffffff" />}
        arrowicon={<Ionicons name="caret-down-outline" size={12} color="#ffffff" />}
        inputStyles={{color:"#ffff",margin:"3px",}}
        boxStyles={{height:"35px",padding:'2px'}}
        dropdownTextStyles={{color:"#ffff"}}
        onSelect={console.log()}
        save="value"
        style={styles.sel}
    /></View>
        </View>
        {title && id && (
          <>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={durationMillis}
              value={positionMillis}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#8E8787"
              thumbTintColor={"purple"}
            />
            <View style={styles.flex3}>
              <Text style={styles.idtxt1}>{((positionMillis/1000)/60).toFixed(2).replace(".",":")}</Text>
              <Text style={styles.idtxt2} >{((durationMillis/1000)/60).toFixed(2).replace(".",":")}</Text>

            </View>
            {/* <Text style={styles.idtxt}>{((positionMillis/1000)/60).toFixed(2).replace(".",":")} / {((durationMillis/1000)/60).toFixed(2).replace(".",":")}</Text> */}
            <View style={styles.flex1}>
              <View style={styles.playerlay}>
                <Pressable style={styles.player} onPress={dailogstuff}>
                  <Ionicons name="play-back" size={32} color="#ffffff" />
                </Pressable>
                {isfromliked === true &&
                  <Pressable style={styles.player} onPress={() => Removelikedsong(title,image,id,artist)}>
                    <Ionicons name="heart" size={32} color="#ffffff" />
                  </Pressable>
                }
                {isfromliked === false &&
                  <Pressable style={styles.player} onPress={() => Likedsong(title,image,id,artist)}>
                  <Ionicons name="heart-outline" size={32} color="#ffffff" />
                </Pressable>
                }
                <Pressable style={styles.player} onPress={startAudio}>
                  <Ionicons name={icon} size={32} color="#ffffff" />
                </Pressable>
                <Pressable style={styles.player} onPress={() => handleDownload(listen, title)}>
                  <Ionicons name="download-outline" size={32} color="#ffffff" />
                </Pressable>
                 <Pressable style={styles.player} onPress={dailogstuff}>
                  <Ionicons name="play-forward" size={32} color="#ffffff" />
                </Pressable>
              </View>
            </View>
             <View style={styles.playervol}>
                <Ionicons style={styles.icon} name="volume-low-outline" size={32} color="#ffffff" />
                <Slider
                  style={styles.volslider}
                  minimumValue={0}
                  maximumValue={1.0}
                  value={0.5}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#8E8787"
                  thumbTintColor={"purple"}
                  onValueChange={(value) => volup(value)}
                />
              </View>
              {/* <Pressable style={styles.quali}>
                <Text style={styles.btntxt}>Choose Quality : {data.quality}</Text>
              </Pressable> */}
          </>
        )}
        
        {lyrics &&(
          <View style={styles.lyricsbody}>
          <Text style={styles.lyricstxt}>Lyrics</Text>
          <Text style={styles.lyrics}>{lyrics}</Text>
        </View>
        )}
      </View>
      {id && (
        <View style={styles.id}>
          <Text style={styles.idtxt}>Song ID: {id}</Text>
          <Text style={styles.idtxt}>Song Quality & Format: {data.quality} | {data.format}</Text>
        </View>
      )}
    </ScrollView>
  ); 

  

}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#090909",
  },
  sel:{
    color:"#ffffff",
  },
  container: {
    padding: 10,
    backgroundColor: "#090909",
    alignContent: "center",
    height: "100%",
  },
  flex3:{
    flex:1,
    flexDirection:"row",
    width:"100%"
  },
  flex1: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 15,
  },
  left:{
    marginLeft:"85%",
  },
  lyrics:{
    color: "#b9b5b5",
    fontSize: 15,
    textAlign:'center',
    
  },
   lyricstxt:{
    color: "#ffffff",
    fontSize: 25,
    margin: 10,
    textAlign:'center',
  },
  lyricsbody:{
    padding:40,
    border:1,
    borderRadius:8,
    backgroundColor:"#212020"
  },
  right:{
    marginRight:"85%",
  },
  right1:{
    position:"relative",
  },
  title: {
    margin: 5,
    padding: 10,
  },
  btntxt: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  btn2txt: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  id: {
    width:"100%",
    alignSelf: "flex-start",
    textAlign: "bottom-left",
  },
  playerlay: {
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  playcard: {
    justifyContent: 'center', alignItems: 'center'
  },
  controlbar: {
    justifyContent: 'center', alignItems: 'center', width: 1000,
  },
  player: {
    margin: 5,
    height: 55,
    backgroundColor: "#393639",
    padding: 10,
    borderRadius: 10,
  },
  quali: {
    margin: 5,
    height: 35,
    backgroundColor: "#393639",
    padding: 10,
    borderRadius: 10,
  },
  hearti: {
    margin: 5,
    width: 55,
    height: 55,
    backgroundColor: "#393639",
    padding: 10,
    borderRadius: 90,
  },
  download: {
    backgroundColor: "#6546a7",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    width: 350,
    height: 45,
  },
  playervol: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
    justifyContent: "flex-start",
    alignContent: "center",
  },
  btn: {
    margin: 5,
    backgroundColor: "#393639",
    padding: 10,
    borderRadius: 10,
  },
  playbox: {
    padding: 10,
    backgroundColor: "#090909",
    alignItems: "center",
    justifyContent: "center",
  },
  textcolor: {
    color: "white",
    fontSize: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  downloadtxt: {
    color: "white",
    fontSize: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  idtxt: {
    color: "#8e8787",
    fontSize: 10,
  },
  idtxt1: {
    color: "#8e8787",
    fontSize: 15,
    textAlign:'left',
    width:"50%"
  },
  idtxt2: {
    color: "#8e8787",
    fontSize: 15,
    textAlign:"right",
    width:"90%",
  },
  music: {
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
    height: 200,
    margin: 5,
  },
  slider: {
    width: '100%',
    height: 50,
  },
  volslider: {
    width: 150,
    height: 50,
  },
  icon: {
    marginTop: 8,
    marginRight: 5,
  },
  
});