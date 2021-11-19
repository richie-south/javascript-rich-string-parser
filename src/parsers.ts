import {Parser} from './types'

export function mentionParser(): Parser<'MentionParser'> {
  const regex: RegExp = /@\(\d+\|(.+?)\)/

  return {
    parse: (text) => {
      const result = regex.exec(text)
      if (result === null) return null

      const match = result[0]
      return {
        type: 'MentionParser',
        match,
        index: result.index,
        id: Number(match.substring(2, match.indexOf('|'))),
        name: match.substring(match.indexOf('|') + 1, match.length - 1),
      }
    },
  }
}

export function emailParser(): Parser<'EmailParser'> {
  const regex: RegExp =
    /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/i

  return {
    parse: (text) => {
      const result = regex.exec(text)
      if (result === null) return null

      return {
        type: 'EmailParser',
        match: result[0],
        index: result.index,
      }
    },
  }
}

export function linkParser(): Parser<'LinkParser'> {
  const regex: RegExp = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/i

  return {
    parse: (text) => {
      const result = regex.exec(text)
      if (result === null) return null

      return {
        type: 'LinkParser',
        match: result[0],
        index: result.index,
      }
    },
  }
}
