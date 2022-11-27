import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Video from "react-native-video";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  FFmpegKit,
  FFprobeKit,
  FFmpegKitConfig,
} from "ffmpeg-kit-react-native";

import { storage } from "./firebase.js";
export default function App() {
  const [image, setImage] = useState(null);

  async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(image);
    if (!dirInfo.exists) {
      console.log("doesnt exist");
    } else {
      console.log(dirInfo);
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("workde");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const ffmpeg = async () => {
    const storageRef = await storage.ref();

    FFmpegKitConfig.selectDocumentForRead("*/*").then((uri) => {
      FFmpegKitConfig.getSafParameterForRead(uri).then((safUrl) => {
        console.log(uri, safUrl);

        FFmpegKit.executeAsync(`-i ${safUrl}  \
-filter_complex \
"[0:v]split=3[v1][v2][v3]; \
[v1]copy[v1out]; [v2]scale=w=1280:h=720[v2out]; [v3]scale=w=640:h=360[v3out]" \
-map [v1out] -c:v:0  libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:0 5M -maxrate:v:0 5M -minrate:v:0 5M -bufsize:v:0 10M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
-map [v2out] -c:v:1 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:1 3M -maxrate:v:1 3M -minrate:v:1 3M -bufsize:v:1 3M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
-map [v3out] -c:v:2 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:2 1M -maxrate:v:2 1M -minrate:v:2 1M -bufsize:v:2 1M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
-map a:0 -c:a:0 aac -b:a:0 96k -ac 2 \
-map a:0 -c:a:1 aac -b:a:1 96k -ac 2 \
-map a:0 -c:a:2 aac -b:a:2 48k -ac 2 \
-f hls \
-hls_time 2 \
-hls_playlist_type vod \
-hls_flags independent_segments \
-hls_segment_type mpegts \
-hls_segment_filename ${storageRef}/stream_%v/data%02d.ts \
-master_pl_name ${storageRef}/master.m3u8 \
-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" ${storageRef}/stream_%v.m3u8`);
      });
    });
  };
  //  FFmpegKit.execute(`-i ${image} `).then(async (session) => {
  //       const returnCode = await session.getReturnCode();

  //     //   if (ReturnCode.isSuccess(returnCode)) {
  //     //       console.log("success")
  //     //     // SUCCESS

  //     //   } else if (ReturnCode.isCancel(returnCode)) {
  //     //     console.log("canceled")
  //     //     // CANCEL

  //     //   } else {
  //     //     console.log("fuck")
  //     //     // ERROR

  //     //   }
  //     });

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={ffmpeg} />
      {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}

      {/* <Video
        source={{
          uri: "https://storage.googleapis.com/ash_test6/transcoded/0103cf11-c27c-404c-9e7b-d1bb1e9c7c42.mp4/mp4/manifest.m3u8",type:"m3u8"
        }}
        style={{ backgroundColor: "black", width: width, height: height }}
      
        controls={true}
        onLoad={(e) => console.log(e)}
        fullscreen={true}
        fullscreenOrientation={"portrait"}
        posterResizeMode="stretch"
        resizeMode="cover"
      /> */}
      <Text>Working</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
