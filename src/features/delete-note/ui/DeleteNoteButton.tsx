import {toast} from '@backpackapp-io/react-native-toast'
import {IconTrash} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {NoteID, useNotesStore} from '@entities/note'
import {useTranslation} from '@shared/i18n'
import {ConfirmationDialog} from '@shared/ui-primitives/ConfirmationDialog'

export const DeleteNoteButton = ({id, beforeDelete}: DeleteNoteButtonProps) => {
  const {t} = useTranslation('DeleteCategoryButton')
  const router = useRouter()
  const {deleteNote} = useNotesStore((state) => ({
    deleteNote: state.deleteNote,
  }))

  const [confirmationIsOpen, setConfirmationIsOpen] = useState(false)

  const onDelete = async () => {
    beforeDelete && beforeDelete()
    try {
      await deleteNote(id)
      router.back()
    } catch (error) {
      toast.error(String(error))
    }
  }

  const closeConfirmation = () => setConfirmationIsOpen(false)
  const openConfirmation = () => setConfirmationIsOpen(true)

  return (
    <>
      <TouchableOpacity onPress={openConfirmation}>
        <IconTrash />
      </TouchableOpacity>
      <ConfirmationDialog
        title={t('confirm.title')}
        description={t('confirm.body')}
        open={confirmationIsOpen}
        onCancel={closeConfirmation}
        onContinue={onDelete}
      />
    </>
  )
}

// TYPES

interface DeleteNoteButtonProps {
  id: NoteID
  beforeDelete?(): void
  className?: string
}
