import {LinearGradient} from 'expo-linear-gradient'
import {StyleProp, ViewStyle} from 'react-native'
import {createShimmerPlaceholder, ShimmerPlaceholderProps} from 'react-native-shimmer-placeholder'

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const Skeleton = ({styles, ...props}: TProps) => {
  const {style} = props
  return <ShimmerPlaceholder contentStyle={style} shimmerStyle={styles} />
}

export default Skeleton

// TYPES

type TProps = TBaseProps & ShimmerPlaceholderProps
type TBaseProps = {
  styles?: StyleProp<ViewStyle>
}
