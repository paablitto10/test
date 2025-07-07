import {icons} from '@tabler/icons-react-native'
import type {IconProps} from '@tabler/icons-react-native'
import {FC} from 'react'

export const GenericIcon: T = ({name, ...props}) => {
  const TablerIcon = icons[name]

  if (!TablerIcon) {
    console.error(`Icon "${name}" not found`)
    return null
  }

  return <TablerIcon {...props} />
}

// TYPES

type T = FC<
  IconProps & {
    name: keyof typeof icons
  }
>
