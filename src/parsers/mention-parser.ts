import {Parser} from '../types'

export function mentionParser(): Parser<'MentionParser'> {
  const regex: RegExp = /@\(\d+\|(.+?)\)/

  return {
    parse: (text, index) => {
      const result = regex.exec(text)
      if (result === null) return null

      const match = result[0]
      return {
        type: 'MentionParser',
        match,
        index: index + result.index,
        subIndex: result.index,
        id: Number(match.substring(2, match.indexOf('|'))),
        name: match.substring(match.indexOf('|') + 1, match.length - 1),
      }
    },
  }
}
