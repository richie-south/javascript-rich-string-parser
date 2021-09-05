import {Match, Parser} from './types'

export class MentionParser implements Parser {
  regex: RegExp = /@\(\d+\|(.+?)\)/

  converter(mention: string): Match {
    return {
      type: 'MentionParser',
      match: mention,
      id: Number(mention.substring(2, mention.indexOf('|'))),
      name: mention.substring(mention.indexOf('|') + 1, mention.length - 1),
    }
  }
}

export class EmailParser implements Parser {
  regex: RegExp = /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/i

  converter(match: string): Match {
    return {
      type: 'EmailParser',
      match,
    }
  }
}

export class LinkParser implements Parser {
  regex: RegExp = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/i

  converter(match: string): Match {
    return {
      type: 'LinkParser',
      match,
    }
  }
}
