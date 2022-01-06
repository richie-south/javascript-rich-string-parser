import {MatchResults, Parser} from './types'

function _textParser<T>(parser: Parser<T>, text: string): MatchResults<T> {
  if (!text) {
    return []
  }

  const match = parser.parse(text)

  if (match === null) {
    return [text]
  }

  const firstPart = text.substring(0, match.index)
  const contentList: MatchResults<T> = []

  if (firstPart.length > 0) {
    contentList.push(firstPart)
  }

  const lastPart = text.substring(match.index + match.match.length, text.length)
  contentList.push(match)

  return contentList.concat(_textParser(parser, lastPart))
}

function _parser<T>(
  parser: Parser<T>,
  text?: string,
  list?: MatchResults<T>,
): MatchResults<T> {
  if (list !== undefined && list.length > 0) {
    return list.flatMap((item) => {
      if (typeof item === 'string') {
        const subList = _textParser(parser, item)
        return subList
      }

      return item
    })
  } else if (text !== undefined && text.length > 0) {
    return _textParser<T>(parser, text)
  }

  return []
}

export function richStringParser<T>(
  text: string,
  parsers: Parser<T>[],
): MatchResults<T> {
  if (!text) {
    return []
  }

  return parsers.reduce((contentList, parser) => {
    return _parser(
      parser,
      contentList.length === 0 && text,
      contentList.length && contentList,
    )
  }, [] as MatchResults<T>)
}
