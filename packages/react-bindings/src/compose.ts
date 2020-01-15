import * as React from 'react'

type ComposeOptions = {
  // TODO: better typings PLZ
  className?: string
  displayName: string
  mapPropsToBehavior?: Function
  mapPropsToStyles?: Function
  handledProps?: string[]
  // shouldForwardProp?: Function
  overrideStyles?: boolean
}

const COMPOSE_CONFIG_PROP_NAME = '__unstable_config'
export const COMPOSE_DISPLAY_NAME_DELIMITER = '🔨'

export const compose = <UserProps, CProps = {}>(
  Component: React.ComponentType<CProps>,
  options: ComposeOptions,
): React.ComponentType<CProps & UserProps> => {
  const ComposedComponent = { ...Component }

  ComposedComponent.displayName = options.displayName

  // We are passing config via props by setting default prop value
  ComposedComponent.defaultProps = { ...(ComposedComponent.defaultProps || {}) }
  // @ts-ignore PLS FIX ME
  ComposedComponent.defaultProps[COMPOSE_CONFIG_PROP_NAME] = options

  if (!options.overrideStyles) {
    ComposedComponent.defaultProps[
      COMPOSE_CONFIG_PROP_NAME
    ].displayName = `${(Component.defaultProps &&
      Component.defaultProps[COMPOSE_CONFIG_PROP_NAME] &&
      Component.defaultProps[COMPOSE_CONFIG_PROP_NAME].displayName) ||
      Component.displayName}${COMPOSE_DISPLAY_NAME_DELIMITER}${
      ComposedComponent.defaultProps[COMPOSE_CONFIG_PROP_NAME].displayName
    }`
  }

  console.log('---------------------')
  console.log(Component.displayName)
  console.log(ComposedComponent.displayName)
  console.log(ComposedComponent.defaultProps[COMPOSE_CONFIG_PROP_NAME].displayName)
  console.log('---------------------')

  return ComposedComponent as any
}

export const useComposedConfig = <P extends { [COMPOSE_CONFIG_PROP_NAME]: ComposeOptions }>(
  props: P,
) => {
  const { [COMPOSE_CONFIG_PROP_NAME]: options } = props

  const {
    className = '',
    displayName,
    handledProps = [],
    mapPropsToBehavior = () => ({}),
    mapPropsToStyles = () => ({}),
    overrideStyles = false,
  } = options || {}

  console.log('useComposedConfig', props, options)

  return {
    behaviorProps: mapPropsToBehavior(props),
    styleProps: mapPropsToStyles(props),
    className,
    displayName,
    handledProps,
    overrideStyles,
  }
}
