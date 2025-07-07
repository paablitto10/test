import {supabase} from '@shared/config/supabase'

export async function handleLogin({email, code}: TProps) {
  try {
    const {data, error} = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    return {data, error}
  } catch (e) {
    throw new Error(`Login error: ${e}`)
  }
}

// TYPES

type TProps = {
  email: string
  code: string
}
