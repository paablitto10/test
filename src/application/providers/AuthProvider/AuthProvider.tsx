import {Session, User as UserSupabase} from '@supabase/supabase-js'
import {useRouter, useSegments, useRootNavigationState} from 'expo-router'
import {useContext, useState, useEffect, createContext, ReactNode} from 'react'
import {AppState} from 'react-native'
import {useResetStores} from '@features/reset-store'
import {getUser, useUserStore} from '@entities/user'
import {supabase} from '@shared/config/supabase'
import {clearStorage} from '@shared/storage/clearStorage'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (!supabase) {
    return
  }
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

type AuthProviderProps = {
  children: ReactNode
}

type AuthProvider = {
  userBySession: UserSupabase | null
  loading: boolean
}

const AuthContext = createContext<AuthProvider>({
  userBySession: null,
  loading: true,
})

export function useAuth() {
  if (!useContext(AuthContext)) {
    throw new Error('useAuth must be used within a <AuthProvider />')
  }

  return useContext(AuthContext)
}

export function AuthProvider({children}: AuthProviderProps) {
  const [loading, setLoading] = useState(true)
  const [userAuth, setAuth] = useState<UserSupabase | null>(null)
  const {handleResetStore} = useResetStores()

  const {setUser} = useUserStore((state) => ({
    setUser: state.setUser,
  }))

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    // https://supabase.com/docs/reference/javascript/auth-onauthstatechange
    const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        try {
          const user = session?.user
          if (user) {
            await handleUser(user)
            setAuth(user)
          } else {
            console.log('onAuthStateChange log-out')
            await handleResetAuth()
          }
        } catch (error) {
          console.error('Error in handleUser:', error)
          await handleResetAuth()
        } finally {
          setLoading(false)
        }
      }, 0)
    })

    return () => {
      authListener!.subscription.unsubscribe()
    }
  }, [])

  const handleUser = async (userAuth: Session['user']) => {
    const user = await getUser(userAuth.id)
    setUser({...user!, email: userAuth.email ?? String(userAuth.user_metadata.email)})
  }

  const handleResetAuth = async () => {
    setAuth(null)
    await clearStorage()
    await handleResetStore()
  }

  useProtectedRoute(userAuth)

  return (
    <AuthContext.Provider value={{userBySession: userAuth, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

function useProtectedRoute(user: UserSupabase | null) {
  const segments = useSegments()
  const router = useRouter()
  const navigationState = useRootNavigationState()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'
    const inAuxiliaryGroup = segments[0] === '(aux)'

    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return
    }

    if (!user && !inAuthGroup && !inAuxiliaryGroup) {
      router.replace('/login')
    } else if (user && inAuthGroup && !inAuxiliaryGroup) {
      router.replace('/(app)/(tabs)')
    }
  }, [user, segments])
}
