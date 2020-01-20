import { compose } from '@fluentui/react-bindings'
import * as React from 'react'

import { createShorthandFactory, ShorthandFactory } from '../../utils'
import Icon, { IconProps } from '../Icon/Icon'
import { SupportedIntrinsicInputProps } from '../../utils/htmlPropsUtils'

export interface CheckboxToggleIconProps extends IconProps {
  checked?: SupportedIntrinsicInputProps['checked']
  disabled?: SupportedIntrinsicInputProps['disabled']
  labelPosition?: 'start' | 'end'
}

const CheckboxToggleIcon: React.ComponentType<CheckboxToggleIconProps> & {
  create: ShorthandFactory<CheckboxToggleIconProps>
} = compose(Icon, {
  displayName: 'CheckboxToggleIcon',
  mapPropsToStyles: props => ({
    outline: props.outline,
    checked: props.checked,
    disabled: props.disabled,
    labelPosition: props.labelPosition,
  }),
})

// @ts-ignore
CheckboxToggleIcon.create = createShorthandFactory({
  // @ts-ignore
  Component: CheckboxToggleIcon,
  mappedProp: 'name',
  allowsJSX: false,
})

export default CheckboxToggleIcon
