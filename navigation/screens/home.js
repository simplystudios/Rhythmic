import { StatusBar } from 'expo-status-bar';
import React,{useEffect,useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function HomeScreen({navigation}){
  const [data,setData]=useState([]);
  const [search, setSearch] = useState('');
  const flatListRef = React.useRef()
  const baseurl = "https://pipedapi.kavin.rocks/"

  useEffect(() => {getsongs(`${baseurl}/search?q=trending%20songs%20india&filter=music_songs`);
  }, []);
  const getsongs = async(aurl) =>{
    let url = aurl;
    let result = await fetch(url);
    result = await result.json();
    setData(result.items)
}
  
  const searchsong = () => { 
    getsongs(
      `${baseurl}/search?q=${search}&filter=music_songs`
    );
    // flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
  }
const updateSearch = (text) => {
    setSearch(text);
  };
    return (
      <View style={styles.container}>
        <View style={styles.search}>
          <TextInput
            onSubmitEditing={(event) =>
              getsongs(
                `${baseurl}/search?q=${event.nativeEvent.text}&filter=music_songs`
              )
            }
            onChangeText={(text) => updateSearch(text)}
            style={styles.tinput}
            placeholderTextColor={"white"}
            placeholder="Search Song or Album..."
          ></TextInput>
          <Pressable onPress={searchsong} style={styles.button}>
            <Text style={styles.buttontxt}>Search</Text>
          </Pressable>
        </View>
        <StatusBar style="auto" />
        {data.length ? (
          <FlatList
            data={data}
            ref={flatListRef}
            contentContainerStyle={{ paddingVertical: 16 }}
            contentInsetAdjustmentBehavior="never"
            snapToAlignment="center"
            style={styles.slide}
            decelerationRate="fast"
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            pagingEnabled
            renderItem={({ item }) => (
              <View>
                <View style={styles.card}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Now Playing", {
                        title: item.title,
                        image: item.thumbnail,
                        id: item.url,
                        artist:item.uploaderName,
                        isfromliked:false,
                        likedsongsl :"",
                      })
                    }
                    style={styles.cardplain}
                  >
                    <View style={styles.imageRow}>
                      <Image
                        source={{ uri: `${item.thumbnail}` }}
                        resizeMode="cover"
                        style={styles.image}
                      ></Image>
                      <View style={styles.textv}>
                          <Text style={styles.musicName}>{item.title}</Text>
                      <Text style={styles.upname}>{item.uploaderName}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                </View>
              </View>
            )}
          />
        ) : null}
      </View>
    );
}
const styles = StyleSheet.create({
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
  upname:{
    flex: 1,
    alignItems: "center",
    display: "flex",
    height:"5vw",
    overflow:'hidden',
    textAlign:"center",
    color:"#706b6b",
    textOverflow: "-o-ellipsis-lastline",
    fontSize: 12,
    marginLeft:16,
    textAlign: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    borderRadius: 10,
    height: 100,
  },
  musicName: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    textAlign:"center",
    color: "#ffffff",
    fontSize: 18,
    marginLeft:20,
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
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#302e35",
    padding: 10,
    width: 300,
    borderRadius: 10,
  },
  textv:{
    flex: 1,
    alignItems: "center",
    display: "flex",
    textAlign:"center",
    color: "#ffffff",
    fontSize: 15,
    marginLeft:20,
    textAlign: "center",
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
    alignContent: "center",
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
    alignContent: "center",
    justifyContent: "center",
    width: 300,
    height: 45,
  },
  buttontxt: {
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    alignContent: "center",
    justifyContent: "center",
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