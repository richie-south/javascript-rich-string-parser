import {Parser} from '../types'

export function mentionParser(): Parser<'MentionParser'> {
  const regex: RegExp = /@\(\d+\|(.+?)\)/

  return {
    parse: (text, index) => {
      const result = regex.exec(text)
      if (result === null) return null

      const match = result[0]
      const delimiter1Position = match.indexOf('|')
      const delimiter2Position = match.indexOf('|', delimiter1Position + 1)
      let name = match.substring(delimiter1Position + 1, match.length - 1)
      let target = undefined

      if (delimiter2Position !== -1) {
        // Mention target exist - adjust mentionTarget and name.
        name = match.substring(delimiter1Position + 1, delimiter2Position)
        target = match.substring(delimiter2Position + 1, match.length - 1)
      }

      return {
        type: 'MentionParser',
        match,
        index: index + result.index,
        subIndex: result.index,
        id: Number(match.substring(2, match.indexOf('|'))),
        name: name,
        target,
      }
    },
  }
}
