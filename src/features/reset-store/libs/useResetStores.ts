import {useNotesStore} from 'src/entities/note'
import {useUserStore} from '@entities/user'

export function useResetStores() {
  const {reset: resetUser} = useUserStore((state) => ({
    reset: state.reset,
  }))
  const {reset: resetNotes} = useNotesStore((state) => ({
    reset: state.reset,
  }))

  const handleResetStore = async () => {
    await resetUser()
    await resetNotes()
  }

  return {
    handleResetStore,
  }
}
