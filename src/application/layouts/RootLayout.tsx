import '../global.css'

import NetInfo from '@react-native-community/netinfo'
import {ThemeProvider, DarkTheme, DefaultTheme} from '@react-navigation/native'
import {PortalHost} from '@rn-primitives/portal'
import * as Sentry from '@sentry/react-native'
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister'
import {focusManager, onlineManager} from '@tanstack/react-query'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import {isRunningInExpoGo} from 'expo'
import * as NavigationBar from 'expo-navigation-bar'
import {useNavigationContainerRef, Stack} from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import {StatusBar} from 'expo-status-bar'
import {cssInterop} from 'nativewind'
import {useEffect, useState} from 'react'
import {AppState, type AppStateStatus, Platform} from 'react-native'
import {KeyboardProvider} from 'react-native-keyboard-controller'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Svg} from 'react-native-svg'
import {LanguageProvider} from '@shared/i18n'
import {useColorPalette} from '@shared/lib/palette'
import {useColorScheme} from '@shared/lib/theme'
import {SheetProvider} from '@shared/sheet-provider'
import {queryStorage} from '@shared/storage/query-storage'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {ToastRoot} from '@shared/toast/ToastRoot'
import {queryClient} from '../libs/queryClient'
import {AppLoaderProvider} from '../providers/AppLoaderProvider'
import {AuthProvider} from '../providers/AuthProvider'
import {CustomPaletteWrapper} from '../providers/CustomPaletteWrapper'
import 'react-native-reanimated'
// Polyfill Intl for iOS hermes
// (1) Always required
import '@formatjs/intl-getcanonicallocales/polyfill-force'
import '@formatjs/intl-locale/polyfill-force'
// (2) Required for Intl.RelativeTimeFormat and Intl.DateTimeFormat
import '@formatjs/intl-pluralrules/polyfill-force'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-numberformat/polyfill-force'
import '@formatjs/intl-numberformat/locale-data/en'
import '@formatjs/intl-relativetimeformat/polyfill-force'
import '@formatjs/intl-relativetimeformat/locale-data/en'

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
})

Sentry.init({
  dsn: __DEV__ ? undefined : process.env.EXPO_PUBLIC_SENTRY_DSN,
  //debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
})

// Online status management
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: queryStorage,
})

cssInterop(Svg, {
  className: {
    target: 'style',
    nativeStyleToProp: {width: true, height: true},
  },
})

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 300,
  fade: true,
})

if (__DEV__) {
  require('../../../ReactotronConfig')
}

function RootLayout() {
  const ref = useNavigationContainerRef()
  const {colorScheme, setColorScheme} = useColorScheme()
  const {getColor} = useColorPalette()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)
  const {preferredTheme} = useUserSettingsStore((state) => ({
    preferredTheme: state.preferredTheme,
  }))

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(getColor('--background'))
      NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark')
    }
  }, [colorScheme])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)

    const loadTheme = async () => {
      if (!preferredTheme) {
        setIsColorSchemeLoaded(true)
        return
      }
      if (preferredTheme !== colorScheme) {
        setColorScheme(preferredTheme)

        setIsColorSchemeLoaded(true)
        return
      }
      setIsColorSchemeLoaded(true)
    }

    loadTheme()

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (ref?.current && !__DEV__) {
      navigationIntegration.registerNavigationContainer(ref)
    }
  }, [ref])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <AuthProvider>
      <AppLoaderProvider>
        <RootLayoutNav />
      </AppLoaderProvider>
    </AuthProvider>
  )
}

export default Sentry.wrap(RootLayout)

// PARTS

function RootLayoutNav() {
  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{persister: asyncStoragePersister}}
    >
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <CustomPaletteWrapper>
              <StatusBar backgroundColor={getColor('--background')} />
              <LanguageProvider>
                <SheetProvider>
                  <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}} />
                    <Stack.Screen name="(app)" options={{headerShown: false, animation: 'none'}} />
                    <Stack.Screen name="(auth)" options={{headerShown: false, animation: 'none'}} />
                    <Stack.Screen
                      name="(aux)"
                      options={{headerShown: false, presentation: 'modal'}}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <ToastRoot />
                  <PortalHost />
                </SheetProvider>
              </LanguageProvider>
            </CustomPaletteWrapper>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  )
}
