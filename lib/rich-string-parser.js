"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richStringParser = void 0;
function _textParser(parser, text, globalIndex = 0) {
    const match = parser.parse(text, globalIndex);
    if (match === null) {
        return null;
    }
    const firstPart = text.substring(0, match.subIndex);
    const contentList = [];
    if (firstPart.length > 0) {
        contentList.push(firstPart);
    }
    const nextPart = text.substring(match.subIndex + match.match.length, text.length);
    contentList.push(match);
    return {
        contentList,
        nextPart,
        globalIndex: globalIndex + match.subIndex + match.match.length,
        end: false,
    };
}
function _runner(parser, _text, index = 0) {
    let contentList = [];
    let text = _text;
    let globalIndex = index;
    while (true) {
        if (!text) {
            return contentList;
        }
        const result = _textParser(parser, text, globalIndex);
        if (result === null) {
            contentList.push(text);
            return contentList;
        }
        contentList = contentList.concat(result.contentList);
        text = result.nextPart;
        globalIndex = result.globalIndex;
    }
}
function _parser(parser, text, list) {
    if (list !== undefined && list.length > 0) {
        let index = 0;
        return list.flatMap((item) => {
            if (typeof item === 'string') {
                return _runner(parser, item, index);
            }
            index = item.index + item.match.length;
            return item;
        });
    }
    return _runner(parser, text);
}
function richStringParser(text, parsers) {
    if (!text) {
        return [];
    }
    return parsers.reduce((contentList, parser) => _parser(parser, text, contentList), []);
}
exports.richStringParser = richStringParser;
