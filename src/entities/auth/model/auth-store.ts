import {GoogleSignin} from '@react-native-google-signin/google-signin'
import * as AppleAuthentication from 'expo-apple-authentication'
import {Platform} from 'react-native'
import {create} from 'zustand'
import {supabase} from '@shared/config/supabase'
import {handleLogin} from '../libs/handleLogin'

interface AuthStoreState {
  loginByGoogle(): Promise<void>
  loginByApple(): Promise<void>
  loginByEmail({email, code}: {email: string; code: string}): Promise<void>
  logout(): Promise<void>
}

export const useAuthStore = create<AuthStoreState>(() => ({
  async loginByGoogle() {
    try {
      await GoogleSignin.hasPlayServices()
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      })

      const response = await GoogleSignin.signIn()
      if (response.type === 'success') {
        const userInfo = response.data

        if (userInfo.idToken) {
          const {error} = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: userInfo.idToken,
          })

          if (error) throw new Error(error.message)
        } else {
          throw new Error('no ID token present!')
        }
      } else {
        // sign in was cancelled by user
        console.log('sign in was cancelled by user')
      }
    } catch (error) {
      alert((error as Error).message)
    }
  },
  async loginByApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (credential.identityToken) {
        const {error} = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        })

        if (error) {
          throw new Error(error.message)
        }
      } else {
        throw new Error('No identityToken.')
      }
    } catch (e) {
      if ((e as Error & {code?: string}).code !== 'ERR_REQUEST_CANCELED') {
        alert((e as Error).message)
      }
    }
  },
  async loginByEmail({email, code}) {
    try {
      const {error} = await handleLogin({
        email: email,
        code: code,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      alert((error as Error).message)
    }
  },
  async logout() {
    try {
      await supabase.auth.signOut()
      if (Platform.OS === 'android') {
        GoogleSignin.configure({})
      }
      await GoogleSignin.signOut()
    } catch (e) {
      console.log('logout', e)
    }
  },
}))
