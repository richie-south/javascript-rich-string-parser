"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richStringParser = void 0;
function _textParser(parser, text, index = 0) {
    const match = parser.parse(text, index);
    if (match === null) {
        return null;
    }
    const firstPart = text.substring(0, match.subIndex);
    const list = [];
    if (firstPart.length > 0) {
        list.push(firstPart);
    }
    const nextPart = text.substring(match.subIndex + match.match.length, text.length);
    list.push(match);
    return {
        list,
        nextPart,
        index: index + match.subIndex + match.match.length,
    };
}
function _runner(parser, _text, _index = 0) {
    let list = [];
    let text = _text;
    let index = _index;
    while (true) {
        if (!text) {
            return list;
        }
        const result = _textParser(parser, text, index);
        if (result === null) {
            list.push(text);
            return list;
        }
        list = list.concat(result.list);
        text = result.nextPart;
        index = result.index;
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
