import {BottomSheetModal} from '@gorhom/bottom-sheet'
import {createContext, useContext} from 'react'

export enum AppSheet {
  INFO = 'info',
}

export type SheetProvider = Record<AppSheet, React.RefObject<BottomSheetModal> | null>

const SheetContext = createContext<SheetProvider>({} as SheetProvider)

export function useSheet() {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error('useSheet must be used within a <SheetProvider />')
  }
  return context
}

export default SheetContext
