import {getAnalytics} from '@react-native-firebase/analytics'
import {getApp, getApps} from '@react-native-firebase/app'
import type {ReactNativeFirebase} from '@react-native-firebase/app'

type FirebaseApp = ReactNativeFirebase.FirebaseApp

let app: FirebaseApp | null = null
let analytics: ReturnType<typeof getAnalytics> | null = null

try {
  if (getApps().length === 0) {
    // Firebase не инициализирован — пропускаем
    throw new Error('Firebase not initialized')
  }

  app = getApp()
  analytics = getAnalytics(app)

  if (!__DEV__) {
    analytics.setAnalyticsCollectionEnabled(true)
  }
} catch (error) {
  if (__DEV__) {
    console.warn('[firebaseAnalytics] Not initialized:', error)
  }
}

export {analytics as firebaseAnalytics}
