import 'ts-node/register';
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: "shaderism",
  slug: "shaderism",
  version: "0.0.1",

  newArchEnabled: true,
  experiments: {
    reactCanary: true,
    turboModules: true
  },

  platforms: ["ios", "android", "web"],

  orientation: "default",
  scheme: "shaderism",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },

  ios: {
    appleTeamId: "C49792BN94",
    bundleIdentifier: "ai.kortexa.shaderism",
    buildNumber: "1"
  },
  android: {
    package: "ai.kortexa.shaderism",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  }
};

export default config;
