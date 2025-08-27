import 'dotenv/config'
import fs from 'fs'

const isFirebaseConfigured =
  fs.existsSync('./GoogleService-Info.plist') && fs.existsSync('./google-services.json')

const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME

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
    newArchEnabled: false,
    platforms: ['ios', 'android'],
    androidNavigationBar: {
      backgroundColor: '#000000',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'native.launch',
      usesAppleSignIn: true,
      appleTeamId: 'YOUR_APPLE_TEAM_ID',
      config: {
        usesNonExemptEncryption: false,
      },
      ...(isFirebaseConfigured && {
        googleServicesFile: './GoogleService-Info.plist',
      }),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#D29647',
      },
      package: 'native.launch',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.USE_BIOMETRIC',
        'android.permission.USE_FINGERPRINT',
        'com.android.vending.BILLING',
      ],
      ...(isFirebaseConfigured && {
        googleServicesFile: './google-services.json',
      }),
    },
    plugins: [
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
          project: 'money-plus-mobile',
          url: 'https://sentry.io/',
        },
      ],
      'expo-asset',
      ...(isFirebaseConfigured ? ['@react-native-firebase/app'] : []),
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
