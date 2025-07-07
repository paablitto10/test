import * as SplashScreen from 'expo-splash-screen'
import {useState, useEffect, useCallback, ReactNode} from 'react'
import {View} from 'react-native'
import {useAuth} from '../AuthProvider'

export function AppLoaderProvider({children}: AppLoaderProviderProps) {
  const [appIsReady, setAppIsReady] = useState(false)
  const {loading} = useAuth()

  useEffect(() => {
    if (!loading) {
      setAppIsReady(true)
    }
  }, [appIsReady, loading])

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      {children}
    </View>
  )
}

// TYPES

type AppLoaderProviderProps = {
  children: ReactNode
}
