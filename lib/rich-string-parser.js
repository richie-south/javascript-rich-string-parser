"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richStringParser = void 0;
function _textParser(parser, text) {
    if (!text) {
        return [];
    }
    const match = parser.parse(text);
    if (match === null) {
        return [text];
    }
    const firstPart = text.substring(0, match.index);
    const contentList = [];
    if (firstPart.length > 0) {
        contentList.push(firstPart);
    }
    const lastPart = text.substring(match.index + match.match.length, text.length);
    contentList.push(match);
    return contentList.concat(_textParser(parser, lastPart));
}
function _parser(parser, text, list) {
    if (list !== undefined && list.length > 0) {
        return list.flatMap((item) => {
            if (typeof item === 'string') {
                return _textParser(parser, item);
            }
            return item;
        });
    }
    return _textParser(parser, text);
}
function richStringParser(text, parsers) {
    if (!text) {
        return [];
    }
    return parsers.reduce((contentList, parser) => {
        return _parser(parser, text, contentList);
    }, []);
}
exports.richStringParser = richStringParser;
