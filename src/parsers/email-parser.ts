import {Parser} from '../types'

export function emailParser(): Parser<'EmailParser'> {
  const regex: RegExp =
    /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/i

  return {
    parse: (text, index) => {
      const result = regex.exec(text)
      if (result === null) return null

      return {
        type: 'EmailParser',
        match: result[0],
        index: index + result.index,
        subIndex: result.index,
      }
    },
  }
}
