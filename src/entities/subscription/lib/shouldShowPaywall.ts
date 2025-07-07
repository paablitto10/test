import {globalStorage, STORAGE_CONSTANT_LAST_PAYWALL_DATE} from '@shared/storage/global-storage'

export const shouldShowPaywall = (): boolean => {
  const lastShownDate = globalStorage.getItem(STORAGE_CONSTANT_LAST_PAYWALL_DATE)
  if (!lastShownDate) {
    return true
  }

  const lastDate = new Date(lastShownDate)
  const today = new Date()

  return (
    today.getFullYear() > lastDate.getFullYear() ||
    today.getMonth() > lastDate.getMonth() ||
    today.getDate() > lastDate.getDate()
  )
}

export const updatePaywallDate = () => {
  const today = new Date()
  globalStorage.setItem(STORAGE_CONSTANT_LAST_PAYWALL_DATE, today.toISOString())
}
