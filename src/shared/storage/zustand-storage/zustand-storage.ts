import {MMKV} from 'react-native-mmkv'
import type {StateStorage} from 'zustand/middleware'

export const zustandStorageMMKV = new MMKV({
  id: 'money-store-storage',
})

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return zustandStorageMMKV.set(name, value)
  },
  getItem: (name) => {
    const value = zustandStorageMMKV.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return zustandStorageMMKV.delete(name)
  },
}
