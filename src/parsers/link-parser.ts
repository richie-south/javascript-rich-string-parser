import {Parser} from '../types'

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
