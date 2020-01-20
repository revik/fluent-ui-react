import { compose } from '@fluentui/react-bindings'
import * as React from 'react'

import { createShorthandFactory, ShorthandFactory } from '../../utils'
import Icon, { IconProps } from '../Icon/Icon'
import { SupportedIntrinsicInputProps } from '../../utils/htmlPropsUtils'

export interface CheckboxIconProps extends IconProps {
  checked?: SupportedIntrinsicInputProps['checked']
  disabled?: SupportedIntrinsicInputProps['disabled']
  labelPosition?: 'start' | 'end'
}

const CheckboxIcon: React.ComponentType<CheckboxIconProps> & {
  create: ShorthandFactory<CheckboxIconProps>
} = compose(Icon, {
  displayName: 'CheckboxIcon',
  mapPropsToStyles: props => ({
    checked: props.checked,
    disabled: props.disabled,
    labelPosition: props.labelPosition,
  }),
})

// @ts-ignore
CheckboxIcon.create = createShorthandFactory({
  // @ts-ignore
  Component: CheckboxIcon,
  mappedProp: 'name',
  allowsJSX: false,
})

export default CheckboxIcon
