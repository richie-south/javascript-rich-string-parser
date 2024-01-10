import {MatchResults, Parser} from './types'

function _textParser<T>(
  parser: Parser<T>,
  text: string,
  index = 0,
): {
  list: MatchResults<T>
  nextPart: string
  index: number
} {
  const match = parser.parse(text, index)

  if (match === null) {
    return null
  }

  const firstPart = text.substring(0, match.subIndex)
  const list: MatchResults<T> = []

  if (firstPart.length > 0) {
    list.push(firstPart)
  }

  const nextPart = text.substring(
    match.subIndex + match.match.length,
    text.length,
  )
  list.push(match)

  return {
    list,
    nextPart,
    index: index + match.subIndex + match.match.length,
  }
}

function _runner<T>(
  parser: Parser<T>,
  _text: string,
  _index: number = 0,
): MatchResults<T> {
  let list: MatchResults<T> = []
  let text: string = _text
  let index: number = _index

  while (true) {
    if (!text) {
      return list
    }

    const result = _textParser<T>(parser, text, index)

    if (result === null) {
      list.push(text)
      return list
    }

    list = list.concat(result.list)
    text = result.nextPart
    index = result.index
  }
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
        return _runner(parser, item, index)
      }

      index = item.index + item.match.length
      return item
    })
  }

  return _runner(parser, text)
}

export function richStringParser<T>(
  text: string,
  parsers: Parser<T>[],
): MatchResults<T> {
  if (!text) {
    return []
  }

  return parsers.reduce(
    (contentList, parser) => _parser(parser, text, contentList),
    [] as MatchResults<T>,
  )
}
