import 'ts-node/register';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
    name: "sheda",
    slug: "sheda",
    version: "0.1.0",

    jsEngine: "hermes",
    newArchEnabled: true,
    experiments: {
        reactCanary: true,
        turboModules: true
    },
    plugins: [
        ["expo-asset", {
            assets: [
            ],
        }],
        ["expo-build-properties", {
            ios: {
                useFrameworks: "static"
            }
        }],
        ["expo-apple-authentication"],
        ["@react-native-firebase/app"],
        ["@react-native-firebase/auth"],
    ],
    platforms: ["ios", "web"],

    userInterfaceStyle: "automatic",
    orientation: "default",
    scheme: "sheda",
    icon: "./assets/icon.png",
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },

    ios: {
        appleTeamId: "C49792BN94",
        bundleIdentifier: "ai.kortexa.sheda",
        buildNumber: "1",
        usesAppleSignIn: true,
        googleServicesFile: "./GoogleService-Info.plist",
    },
    android: {
        package: "ai.kortexa.sheda",
        versionCode: 1,
        googleServicesFile: "./google-services.json",
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
