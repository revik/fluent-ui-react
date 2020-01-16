import * as _ from 'lodash'
import { ComponentInfo, ComponentProp } from '../types'
import componentInfoContext from './componentInfoContext'
import { exampleSourcesContext } from './exampleContexts'

const categoryOrder = ['Slots', 'States', 'Variants', 'Callbacks']

// Consider moving to constants
const getPropCategory = (propDef: ComponentProp) => {
  if (/on[A-Z]/.test(propDef.name)) {
    return 'Callbacks'
  }

  if (propDef.types.some(type => type.name === 'ShorthandValue')) {
    return 'Slots'
  }

  if (
    [
      'active',
      'checked',
      'disabled',
      'indeterminate',
      'readOnly',

      'open',
      'closed',

      'hidden',
      'visible',
      'focus',

      'loading',
      'success',
      'error',
      'warning',
    ].some(state => propDef.name === state)
  ) {
    return 'States'
  }

  return 'Variants'
}

/**
 * Given a `displayName`, return all the `componentInfo` prop definitions for this component
 * that do not have a corresponding documentation example.
 */
function getMissingDocExamples(
  displayName: string,
): {
  info: ComponentInfo
  prop: ComponentProp
  category: string
}[] {
  const ignorePropPatterns = [
    /animation/,
    /accessibility/,
    /as/,
    /className/,
    /design/,
    /styles/,
    /variables/,
    /default[A-Z]/,
  ]
  const info = componentInfoContext.byDisplayName[displayName]
  const patternForComponentExample = `\\./${displayName}/[\\w/]+Example`

  const examplePaths = exampleSourcesContext
    .keys()
    .filter(path => new RegExp(patternForComponentExample).test(path))

  return info.props
    .filter(propDef => !ignorePropPatterns.some(regExp => regExp.test(propDef.name)))
    .reduce((acc, propDef) => {
      const pascalPropName = _.startCase(propDef.name).replace(/ /g, '')
      const examplePattern = `${patternForComponentExample}${pascalPropName}\\.\\w+`
      const hasExample = examplePaths.some(path => new RegExp(examplePattern).test(path))

      if (!hasExample) {
        acc.push({ info, prop: propDef, category: getPropCategory(propDef) })
      }

      return acc
    }, [])
}

export default getMissingDocExamples
