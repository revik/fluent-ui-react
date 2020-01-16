import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import * as React from 'react'

import { Header, Segment, Text, constants } from '@fluentui/react'
import { CodeSnippet } from '@fluentui/docs-components'

import { exampleIndexContext, getMissingDocExamples } from 'docs/src/utils'

const pkg = require('../../../../packages/react/package.json')

interface ComponentExamplesProps {
  displayName: string
}

function getExamplesElement(displayName: string) {
  const indexPath = _.find(exampleIndexContext.keys(), path =>
    new RegExp(`\/${displayName}\/index\.tsx$`).test(path),
  )

  if (!indexPath) {
    return null
  }

  const ExamplesElement = React.createElement(exampleIndexContext(indexPath).default) as any
  if (!ExamplesElement) {
    return null
  }

  return ExamplesElement
}

/**
 Avoid the boiler plate.
 If we can show what the file should look like, just generate it and notify the dev.

 prepush - confirm missing examples, plop to file if requested.
 */

export class ComponentExamples extends React.Component<ComponentExamplesProps, any> {
  static propTypes = {
    displayName: PropTypes.string.isRequired,
  }

  render() {
    const { displayName } = this.props
    const ExamplesElement = getExamplesElement(displayName)
    const missingExamples = _.sortBy(
      _.toPairs(_.groupBy(getMissingDocExamples(displayName), 'category')),
      ([category]) => constants.exampleCategoryOrder.indexOf(category),
    )

    console.log(missingExamples)

    return (
      <>
        {Object.keys(missingExamples).length > 0 && (
          <>
            <Header
              align="center"
              content="⚠ MISSING EXAMPLES ⚠"
              description={
                <span>
                  See <code>.github/document-a-feature.md</code> for instructions.
                </span>
              }
            />
            {_.flatMap(missingExamples, ([category, missing]) => {
              console.log({ missing })

              return (
                <div key={category}>
                  <Header as="h3" align="center" styles={{ color: 'inherit', margin: 0 }}>
                    {_.upperCase(category)}
                  </Header>

                  {_.map(missing, ({ prop }) => {
                    console.error(
                      `\`${displayName}\` is missing an example for the \`${prop.name}\` prop.`,
                    )

                    const exampleName = [
                      _.startCase(displayName),
                      _.startCase(prop.name),
                      'Example',
                    ]
                      .join('')
                      .replace(/ /g, '')

                    return (
                      <Segment key={prop.name} inverted color="red" styles={{ margin: '2em 0' }}>
                        <Header as="h3" styles={{ color: 'inherit', margin: 0 }}>
                          {_.startCase(prop.name)}
                        </Header>

                        <Text styles={{ display: 'inline-block', marginBottom: '1em' }}>
                          {prop.description}
                        </Text>

                        <CodeSnippet
                          fitted
                          label={null}
                          mode="jsx"
                          value={`
                            import { ${displayName} } from '${pkg.name}'

                            const ${exampleName} = () => <${displayName} ${prop.name}={${_.map(
                            prop.types,
                            'value',
                          ).join('|')}} />

                            export default ${exampleName}
                          `}
                        />
                      </Segment>
                    )
                  })}
                </div>
              )
            })}
          </>
        )}
        {ExamplesElement || (
          <Segment inverted color="red">
            Looks like we're missing <code title={displayName}>{`<${displayName} />`}</code>{' '}
            examples.
          </Segment>
        )}
      </>
    )
  }
}
