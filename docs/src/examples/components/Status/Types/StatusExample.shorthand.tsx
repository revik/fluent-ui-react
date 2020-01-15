import { createTheme, mergeThemes } from '@fluentui/styles'
import { Provider, Status, themes } from '@fluentui/react'
import { compose } from '@fluentui/react-bindings'
import * as React from 'react'
import * as PropTypes from 'prop-types'

const customTheme = mergeThemes(
  themes.teams,
  createTheme(
    {
      componentStyles: {
        OverrideStatus: {
          root: () => ({
            backgroundColor: 'pink',
            display: 'inline-flex',
            margin: '5px',
            height: '30px',
            width: '30px',
          }),
        },
        ComposedStatus: {
          root: ({ props: p }) => ({
            borderRadius: '10px',
            height: '30px',
            width: '30px',

            ...(p.square && { borderRadius: 0 }),
          }),
        },
        MultipleStatus: {
          root: () => ({
            // borderRadius: '25px',
            backgroundColor: 'red',
          }),
        },
      },
    },
    'custom',
  ),
)

type OverrideStatusProps = {
  title: never
  disabled?: boolean
  name: string
}

const OverrideStatus = compose<OverrideStatusProps>(Status, {
  displayName: 'OverrideStatus',
  // Forces to use styles defined only for this displayName, defaults to false
  // [replacing previous styles]
  overrideStyles: true,

  mapPropsToBehavior: props => ({
    name: props.name,
  }),
  mapPropsToStyles: props => ({
    disabled: props.disabled,
  }),

  // We have two additional props: `name` & `disabled`

  // Existing approach forces us to specify only `name`
  handledProps: ['name'],

  // Emotion approach, allows more flexibility
  // shouldForwardProp: propName => propName === 'disabled',
})

OverrideStatus.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  // @ts-ignore
  title: PropTypes.any, // should be never???
}

type ComposedStatusProps = {
  square?: boolean
}

const ComposedStatus = compose<ComposedStatusProps>(Status, {
  displayName: 'ComposedStatus',
  // No sence as it's defaults to false
  overrideStyles: false,

  mapPropsToStyles: props => ({
    square: props.square,
  }),
})

ComposedStatus.propTypes = {
  square: PropTypes.bool,
}

const MultipleStatus = compose(ComposedStatus, {
  displayName: 'MultipleStatus',
  // No sense as it's defaults to false
  overrideStyles: false,

  // TODO is not merged with previous
  mapPropsToStyles: props => ({
    square: props.square,
  }),
})

const StatusExampleShorthand = () => (
  <Provider theme={customTheme}>
    <h2>
      Default <code>Status</code>
    </h2>
    <Status title="default state" />
    <h2>
      <code>ComposedStatus</code>
    </h2>
    <ComposedStatus />
    <ComposedStatus square />
    <h2>
      Multiple composed <code>Status</code>
    </h2>
    <MultipleStatus />
    <MultipleStatus square />
    <h2>
      Composed <code>OverrideStatus</code> with replaced styles
    </h2>
    <OverrideStatus
      accessibility={props => ({ attributes: { root: { 'data-shift': props.name } } })}
      name="Hoba!"
    />
    <OverrideStatus disabled />
  </Provider>
)

export default StatusExampleShorthand
