import {Match, Parser} from './types'

export function mentionParser(): Parser<'MentionParser'> {
  const regex: RegExp = /@\(\d+\|(.+?)\)/

  return {
    findMatch: (text) => {
      const result = regex.exec(text)
      if (result === null) return null

      return {
        value: result[0],
        index: result.index,
      }
    },

    converter: (mention) => {
      return {
        type: 'MentionParser',
        match: mention,
        id: Number(mention.substring(2, mention.indexOf('|'))),
        name: mention.substring(mention.indexOf('|') + 1, mention.length - 1),
      }
    },
  }
}

export function emailParser(): Parser<'EmailParser'> {
  const regex: RegExp =
    /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/i

  return {
    findMatch: (text) => {
      const result = regex.exec(text)
      if (result === null) return null

      return {
        value: result[0],
        index: result.index,
      }
    },

    converter: (match) => {
      return {
        type: 'EmailParser',
        match,
      }
    },
  }
}

export function linkParser(): Parser<'LinkParser'> {
  const regex: RegExp = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/i

  return {
    findMatch: (text) => {
      const result = regex.exec(text)
      if (result === null) return null

      return {
        value: result[0],
        index: result.index,
      }
    },

    converter: (match) => {
      return {
        type: 'LinkParser',
        match,
      }
    },
  }
}
