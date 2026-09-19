import JSZip from 'jszip';
import { PROJECT_CODE_FILES } from '../data/projectFiles';

export async function downloadReactNativeProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root files
  zip.file('app.json', JSON.stringify({
    expo: {
      name: "ReactNativeGallery",
      slug: "react-native-gallery",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "automatic",
      splash: {
        backgroundColor: "#0B0F19"
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          backgroundColor: "#ffffff"
        },
        package: "com.intern.reactnativegallery",
        permissions: ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE", "MEDIA_LIBRARY"]
      },
      plugins: [
        [
          "expo-media-library",
          {
            photosPermission: "Allow ReactNativeGallery to save downloaded photos to your camera roll."
          }
        ]
      ]
    }
  }, null, 2));

  zip.file('tsconfig.json', JSON.stringify({
    extends: "expo/tsconfig.base",
    compilerOptions: {
      strict: true
    }
  }, null, 2));

  // Add all files from PROJECT_CODE_FILES
  for (const file of PROJECT_CODE_FILES) {
    zip.file(file.path, file.content);
  }

  // Generate zip file blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'ReactNativeGallery-Intern-Assignment.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
