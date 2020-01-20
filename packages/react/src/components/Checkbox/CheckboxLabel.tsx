import { compose } from '@fluentui/react-bindings'

import { createShorthandFactory, ShorthandFactory } from '../../utils'
import Text, { TextProps } from '../Text/Text'
import * as React from 'react'

export interface CheckboxLabelProps extends TextProps {
  labelPosition?: 'start' | 'end'
}

const CheckboxLabel: React.ComponentType<CheckboxLabelProps> & {
  create: ShorthandFactory<CheckboxLabelProps>
} = compose<CheckboxLabelProps>(Text, {
  displayName: 'CheckboxLabel',
  mapPropsToStyles: props => ({ labelPosition: props.labelPosition }),
})

// @ts-ignore
CheckboxLabel.create = createShorthandFactory({
  // @ts-ignore
  Component: CheckboxLabel,
  mappedProp: 'content',
})

export default CheckboxLabel
