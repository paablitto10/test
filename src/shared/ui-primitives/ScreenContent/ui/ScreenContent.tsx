import {NativeStackNavigationOptions} from '@react-navigation/native-stack'
import {useNavigation} from 'expo-router'
import {ReactNode, memo, useEffect, useRef} from 'react'
import {Animated, BackHandler, KeyboardAvoidingView} from 'react-native'
import {Edge, SafeAreaView} from 'react-native-safe-area-context'
import {isIos} from '@shared/lib/isIos'
import {cn} from '@shared/lib/utils'

const IS_IOS = isIos()

export const ScreenContent = memo((props: ScreenProps) => {
  const navigation = useNavigation()
  const {
    children,
    avoiding = true,
    edges = ['top', 'bottom', 'left', 'right'],
    excludeEdges = [],
    backgroundColor,
    navigationOptions,
    disableBackHandler = false,
  } = props

  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [opacityAnim])

  useEffect(() => {
    navigation?.setOptions({
      //headerShown: true,
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      gestureEnabled: !disableBackHandler,
    })

    if (disableBackHandler) {
      navigation?.setOptions({
        headerLeft: undefined,
        headerBackTitle: undefined,
      })
    }

    BackHandler.addEventListener('hardwareBackPress', () => disableBackHandler)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => disableBackHandler)
    }
  }, [])

  useEffect(() => {
    if (navigationOptions) {
      navigation?.setOptions({
        ...navigationOptions,
      })
    }
  }, [navigationOptions, navigation])

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={IS_IOS ? 'padding' : 'height'}
      enabled={avoiding}
    >
      <Animated.View
        className={cn('flex-1', backgroundColor ?? 'bg-background')}
        style={[{opacity: opacityAnim}]}
      >
        <SafeAreaView edges={edges.filter((el) => !excludeEdges.includes(el))} style={{flex: 1}}>
          {children}
        </SafeAreaView>
      </Animated.View>
    </KeyboardAvoidingView>
  )
})

// TYPES

type ScreenProps = {
  children: ReactNode
  edges?: Edge[]
  excludeEdges?: Edge[]
  backgroundColor?: string | undefined
  avoiding?: boolean
  navigationOptions?: Partial<NativeStackNavigationOptions>
  disableBackHandler?: boolean
}
