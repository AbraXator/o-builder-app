import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PermissionsAndroid, Platform } from "react-native";

async function hasAndroidPermission() {
  const version = typeof Platform.Version === "string" ? Number.parseInt(Platform.Version) : Platform.Version; 
  const getCheckPermissionPromise = async () => {
    if (version >= 33) {
      const [hasReadMediaImagesPermission, hasReadMediaVideoPermission] = await Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
      ]);
      return hasReadMediaImagesPermission && hasReadMediaVideoPermission;
    } else {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = async () => {
    if (version >= 33) {
      console.log("Getting permissions");

      const statuses = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      return statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
        PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  return await getRequestPermissionPromise();
}

export async function savePicture(path: string) {
  console.log("Saving image")
  if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    return;
  }

  console.log("have permission")

  CameraRoll.saveAsset(path, { type: "photo" })
};