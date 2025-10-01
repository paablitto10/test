import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {supabase} from '@shared/config/supabase'

export const loginByGoogle = async (): Promise<void> => {
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
}
