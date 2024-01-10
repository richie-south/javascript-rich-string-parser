import {MatchResults, Parser} from './types'

function _textParser<T>(parser: Parser<T>, text: string, globalIndex = 0): any {
  const match = parser.parse(text, globalIndex)

  if (match === null) {
    return null
  }

  const firstPart = text.substring(0, match.subIndex)
  const contentList: MatchResults<T> = []

  if (firstPart.length > 0) {
    contentList.push(firstPart)
  }

  const nextPart = text.substring(
    match.subIndex + match.match.length,
    text.length,
  )
  contentList.push(match)

  return {
    contentList,
    nextPart,
    globalIndex: globalIndex + match.subIndex + match.match.length,
    end: false,
  }
}

function _runner<T>(
  parser: Parser<T>,
  _text: string,
  index: number = 0,
): MatchResults<T> {
  let contentList: MatchResults<T> = []
  let text = _text
  let globalIndex = index

  while (true) {
    if (!text) {
      return contentList
    }

    const result = _textParser<T>(parser, text, globalIndex)

    if (result === null) {
      contentList.push(text)
      return contentList
    }

    contentList = contentList.concat(result.contentList)
    text = result.nextPart
    globalIndex = result.globalIndex
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
