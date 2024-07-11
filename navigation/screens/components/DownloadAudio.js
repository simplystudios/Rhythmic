import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

const handleDownload = async (url, title) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
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

export default handleDownload;
