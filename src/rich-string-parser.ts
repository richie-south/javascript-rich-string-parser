import {MatchResults, Parser} from './types'

function _textParser<T>(
  parser: Parser<T>,
  text: string,
  globalIndex = 0,
): MatchResults<T> {
  if (!text) {
    return []
  }

  const match = parser.parse(text, globalIndex)

  if (match === null) {
    return [text]
  }

  const firstPart = text.substring(0, match.subIndex)
  const contentList: MatchResults<T> = []

  if (firstPart.length > 0) {
    contentList.push(firstPart)
  }

  const lastPart = text.substring(
    match.subIndex + match.match.length,
    text.length,
  )
  contentList.push(match)

  return contentList.concat(
    _textParser(
      parser,
      lastPart,
      globalIndex + match.subIndex + match.match.length,
    ),
  )
}

function _parser<T>(
  parser: Parser<T>,
  text?: string,
  list?: MatchResults<T>,
): MatchResults<T> {
  if (list !== undefined && list.length > 0) {
    let index = 0
    return list.flatMap((item) => {
      if (typeof item === 'string') {
        return _textParser(parser, item, index)
      }

      index = item.index + item.match.length
      return item
    })
  }

  return _textParser<T>(parser, text)
}

export function richStringParser<T>(
  text: string,
  parsers: Parser<T>[],
): MatchResults<T> {
  if (!text) {
    return []
  }

  return parsers.reduce((contentList, parser) => {
    return _parser(parser, text, contentList)
  }, [] as MatchResults<T>)
}
