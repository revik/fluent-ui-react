import { DangerJS } from './types'
import { componentInfoContext, getMissingDocExamples } from '../../docs/src/utils'

export default async ({ danger, fail, warn }: DangerJS) => {
  componentInfoContext.parents.forEach(info => {
    getMissingDocExamples(info.displayName).forEach(({ prop }) => {
      warn(`Missing ${info.displayName} example for ${prop.name}`)
    })
  })
}
