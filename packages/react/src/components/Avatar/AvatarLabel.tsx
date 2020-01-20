import { compose } from '@fluentui/react-bindings'

import { createShorthandFactory, SizeValue } from '../../utils'
import Label, { LabelProps } from '../Label/Label'

export interface AvatarLabelProps extends LabelProps {
  size?: SizeValue
}

const AvatarLabel = compose(Label, {
  displayName: 'AvatarLabel',
  mapPropsToStyles: props => ({ size: props.size }),
})

// @ts-ignore
AvatarLabel.create = createShorthandFactory({
  // @ts-ignore
  Component: AvatarLabel,
  mappedProp: 'content',
})

export default AvatarLabel
