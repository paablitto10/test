import {ReactNode} from 'react'
import {View} from 'react-native'
import {cn} from '@shared/lib/utils'

export function FinalForm({children, className}: FormProps) {
  return <View className={cn(className, 'gap-8')}>{children}</View>
}

// TYPES

interface FormProps {
  children: ReactNode
  className?: string
}
