import {useEffect} from 'react'
import {OneSignal, LogLevel} from 'react-native-onesignal'

export function useOneSignal() {
  useEffect(() => {
    if (__DEV__) {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose)
    }
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? '')
  }, [])
}
