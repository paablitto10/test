import {toast} from '@backpackapp-io/react-native-toast'
import {useEffect} from 'react'
import {Platform} from 'react-native'
import Purchases, {LOG_LEVEL} from 'react-native-purchases'

export function useInitializePurchases() {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.ERROR)

    if (Platform.OS === 'ios') {
      if (!process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS) {
        toast.error('Missing RevenueCat API key')
      } else {
        Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
        })
      }
    } else if (Platform.OS === 'android') {
      if (!process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID) {
        toast.error('Missing RevenueCat API key')
      } else {
        Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
        })
      }
    }
  }, [])
}
