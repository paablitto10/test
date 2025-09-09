import 'dotenv/config'
import fs from 'fs'

const isFirebaseConfiguredForAndroid = fs.existsSync('./google-services.json')
const isFirebaseConfiguredForIos = fs.existsSync('./GoogleService-Info.plist')

const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME
const isProd = process.env.APP_ENV === 'production'

export default {
  expo: {
    name: 'NativeLaunch',
    slug: 'native-launch',
    description: 'Expo start kit',
    version: '1.0.0',
    owner: 'jonypopov',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'nativelaunch',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    platforms: ['ios', 'android'],
    androidNavigationBar: {
      backgroundColor: '#000000',
    },
    ios: {
      deploymentTarget: '16.0',
      supportsTablet: true,
      bundleIdentifier: 'com.nativelaunch.app',
      usesAppleSignIn: true,
      appleTeamId: 'YOUR_APPLE_TEAM_ID',
      config: {
        usesNonExemptEncryption: false,
      },
      ...(isFirebaseConfiguredForIos && {
        googleServicesFile: './GoogleService-Info.plist',
      }),
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
      },
      entitlements: {
        'aps-environment': isProd ? 'production' : 'development', // ✅ Required for push notification, change to "production" for Testflight and App Store builds
        'com.apple.security.application-groups': ['group.{YOUR_BUNDLE_ID}.onesignal'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#D29647',
      },
      package: 'com.nativelaunch.app',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.USE_BIOMETRIC',
        'android.permission.USE_FINGERPRINT',
        'com.android.vending.BILLING',
      ],
      ...(isFirebaseConfiguredForAndroid && {
        googleServicesFile: './google-services.json',
      }),
    },
    plugins: [
      [
        'onesignal-expo-plugin',
        {
          mode: 'development',
        },
      ],
      'expo-router',
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/OpenSans-Regular.ttf',
            './assets/fonts/OpenSans-Medium.ttf',
            './assets/fonts/OpenSans-SemiBold.ttf',
            './assets/fonts/OpenSans-Bold.ttf',
            './assets/fonts/OpenSans-Italic.ttf',
          ],
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#121212',
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          dark: {
            image: './assets/images/splash-icon.png',
            backgroundColor: '#121212',
          },
        },
      ],
      ...(iosUrlScheme ? [['@react-native-google-signin/google-signin', {iosUrlScheme}]] : []),
      [
        'expo-image-picker',
        {
          photosPermission:
            'Allow $(PRODUCT_NAME) accesses your photos for scanning invoices and transactions',
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID to secure your account',
        },
      ],
      'expo-localization',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      'expo-apple-authentication',
      [
        '@sentry/react-native/expo',
        {
          organization: 'money-plus',
          project: 'YOUR_SENTRY_PROJECT_ID',
          url: 'https://sentry.io/',
        },
      ],
      'expo-asset',
      ...(isFirebaseConfiguredForIos && isFirebaseConfiguredForAndroid
        ? ['@react-native-firebase/app']
        : []),
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: 'YOUR_PROJECT_ID',
      },
      router: {
        origin: false,
      },
    },
  },
}
