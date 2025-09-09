import {MMKV} from 'react-native-mmkv'
import type {SupportedStorage} from '@supabase/supabase-js'

const supabaseStorageMMKV = new MMKV({
  id: 'supabase-storage',
})

export const supabaseStorage = {
  setItem: (name, value) => supabaseStorageMMKV.set(name, value),
  getItem: (name) => {
    const value = supabaseStorageMMKV.getString(name)
    return value ?? null
  },
  removeItem: (name) => supabaseStorageMMKV.delete(name),
} satisfies SupportedStorage
