import {FlashList} from '@shopify/flash-list'
import {RefObject} from 'react'
import {Note} from 'src/entities/note'
import {convertDateToLocalISOString} from '@shared/lib/dates'

export const groupNotesByDate = (
  notes: Note[],
  list: RefObject<FlashList<Note | TSectionHeader>>
): (Note | TSectionHeader)[] => {
  notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return notes.reduce<(Note | TSectionHeader)[]>((flatList, note) => {
    const date = convertDateToLocalISOString(note.created_at, {skipTime: true})
    const lastItem = flatList[flatList.length - 1]

    const lastItemDate =
      lastItem && 'created_at' in lastItem
        ? convertDateToLocalISOString(lastItem.created_at, {skipTime: true})
        : null

    if (lastItemDate !== date) {
      flatList.push({date})
    }

    flatList.push(note)
    list?.current?.prepareForLayoutAnimationRender()
    return flatList
  }, [])
}

// TYPES

export type TSectionHeader = {
  date: string
}
