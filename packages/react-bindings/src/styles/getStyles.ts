import {
  ComponentSlotStylesInput,
  ComponentSlotStylesPrepared,
  ComponentStyleFunctionParam,
  ComponentVariablesObject,
  DebugData,
  ICSSInJSStyle,
  isDebugEnabled,
  mergeComponentStyles,
  mergeComponentVariables,
  PropsWithVarsAndStyles,
  withDebugId,
} from '@fluentui/styles'
import cx from 'classnames'
import * as _ from 'lodash'

import resolveStylesAndClasses from './resolveStylesAndClasses'
import {
  ComponentDesignProp,
  ComponentSlotClasses,
  RendererParam,
  RendererRenderRule,
  StylesContextValue,
} from '../styles/types'

type GetStylesOptions = StylesContextValue<{
  renderRule: RendererRenderRule
}> & {
  className?: string
  displayName: string
  props: PropsWithVarsAndStyles & { design?: ComponentDesignProp }
  rtl: boolean
  saveDebug: (debug: DebugData | null) => void

  __experimental_composeName?: string
  __experimental_overrideStyles?: boolean
}

export type GetStylesResult = {
  classes: ComponentSlotClasses
  variables: ComponentVariablesObject
  styles: ComponentSlotStylesPrepared
  theme: StylesContextValue['theme']
}

const getStyles = (options: GetStylesOptions): GetStylesResult => {
  const {
    className,
    disableAnimations,
    displayName,
    props,
    renderer,
    rtl,
    saveDebug,
    theme,
    // TODO: Restore me PLZ
    // _internal_resolvedComponentVariables: resolvedComponentVariables,

    __experimental_composeName: composeName, // Second displayName
    __experimental_overrideStyles: overrideStyles,
  } = options

  const resolvedVariables = mergeComponentVariables(
    theme.componentVariables[displayName],
    composeName && theme.componentVariables[composeName],
    withDebugId(props.variables, 'props.variables'),
  )(theme.siteVariables)

  // Resolve styles using resolved variables, merge results, allow props.styles to override
  const mergedStyles: ComponentSlotStylesPrepared = mergeComponentStyles(
    overrideStyles ? undefined : theme.componentStyles[displayName],
    composeName ? theme.componentStyles[composeName] : undefined,
    props.design && withDebugId({ root: props.design }, 'props.design'),
    props.styles && withDebugId({ root: props.styles } as ComponentSlotStylesInput, 'props.styles'),
  )

  const styleParam: ComponentStyleFunctionParam = {
    displayName,
    props,
    variables: resolvedVariables,
    theme,
    rtl,
    disableAnimations,
  }

  // Fela plugins rely on `direction` param in `theme` prop instead of RTL
  // Our API should be aligned with it
  // Heads Up! Keep in sync with Design.tsx render logic
  const direction = rtl ? 'rtl' : 'ltr'
  const felaParam: RendererParam = {
    theme: { direction },
    disableAnimations,
    displayName, // does not affect styles, only used by useEnhancedRenderer in docs
  }

  const { resolvedStyles, resolvedStylesDebug, classes } = resolveStylesAndClasses(
    mergedStyles,
    styleParam,
    (style: ICSSInJSStyle) => renderer.renderRule(() => style, felaParam),
  )

  classes.root = cx(className, classes.root, props.className)

  // conditionally add sources for evaluating debug information to component
  if (process.env.NODE_ENV !== 'production' && isDebugEnabled) {
    saveDebug({
      componentName: displayName,
      componentVariables: _.filter(
        resolvedVariables._debug,
        variables => !_.isEmpty(variables.resolved),
      ),
      componentStyles: resolvedStylesDebug,
      siteVariables: _.filter(theme.siteVariables._debug, siteVars => {
        if (_.isEmpty(siteVars) || _.isEmpty(siteVars.resolved)) {
          return false
        }

        const keys = Object.keys(siteVars.resolved)
        if (
          keys.length === 1 &&
          keys.pop() === 'fontSizes' &&
          _.isEmpty(siteVars.resolved['fontSizes'])
        ) {
          return false
        }

        return true
      }),
    })
  }

  return {
    classes,
    variables: resolvedVariables,
    styles: resolvedStyles,
    theme,
  }
}

export default getStyles
