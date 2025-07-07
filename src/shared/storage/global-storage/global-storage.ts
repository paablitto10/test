import {MMKV} from 'react-native-mmkv'

export const globalStorageMMKV = new MMKV({
  id: 'money-global-storage',
})

export const globalStorage = {
  setItem: (name: string, value: string) => {
    return globalStorageMMKV.set(name, value)
  },
  getItem: (name: string) => {
    const value = globalStorageMMKV.getString(name)
    return value ?? null
  },
  getBoolean: (name: string) => {
    return globalStorageMMKV.getBoolean(name)
  },
  setBoolean: (name: string, value: boolean) => {
    return globalStorageMMKV.set(name, value)
  },
  removeItem: (name: string) => {
    return globalStorageMMKV.delete(name)
  },
}
