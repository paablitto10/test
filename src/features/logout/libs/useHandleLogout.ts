// eslint-disable-next-line import/no-restricted-paths
import {useResetStores} from '@features/reset-store'
import {useAuthStore} from '@entities/auth'
import {clearNoteImagesCache} from '@entities/note'
import {clearStorage} from '@shared/storage/clearStorage'

export function useHandleLogout() {
  const {logout} = useAuthStore((state) => ({
    logout: state.logout,
  }))
  const {handleResetStore} = useResetStores()

  const handleLogout = async () => {
    await clearStorage()
    await logout()
    await handleResetStore()
    await clearNoteImagesCache()
  }

  return {
    handleLogout,
  }
}
