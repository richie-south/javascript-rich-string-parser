export type Match = {
  match: string
  type: 'MentionParser' | 'EmailParser' | 'LinkParser' | string
  [key: string]: any
}

export interface Parser {
  regex: RegExp
  converter: (match: string) => Match
}

export class MentionParser {
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
  regex: RegExp = /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/

  converter(match: string) {
    return {
      type: 'EmailParser',
      match,
    }
  }
}

export class LinkParser implements Parser {
  regex: RegExp = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/

  converter(match: string): Match {
    return {
      type: 'LinkParser',
      match,
    }
  }
}
