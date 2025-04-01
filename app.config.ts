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
        [
            "expo-asset",
            {
                assets: [
                ],
            }
        ],
        ["expo-apple-authentication"],
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
    },
    android: {
        package: "ai.kortexa.sheda",
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
