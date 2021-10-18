"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richStringParser = void 0;
function _textParser(parser, text) {
    if (!text) {
        return [];
    }
    const match = parser.findMatch(text);
    if (match === null) {
        return [text];
    }
    const firstPart = text.substring(0, match.index);
    const contentList = [];
    if (firstPart.length > 0) {
        contentList.push(firstPart);
    }
    const lastPart = text.substring(match.index + match.value.length, text.length);
    contentList.push(parser.converter(match.value));
    return [...contentList, ..._textParser(parser, lastPart)];
}
function _parser(parser, text, list) {
    if (list != undefined && list.length > 0) {
        return list.flatMap((item) => {
            if (typeof item === 'string') {
                const subList = _textParser(parser, item);
                return subList;
            }
            return item;
        });
    }
    else if (text != undefined && text.length > 0) {
        return _textParser(parser, text);
    }
    return [];
}
function richStringParser(text, parsers) {
    if (!text) {
        return [];
    }
    return parsers.reduce((contentList, parser) => {
        return _parser(parser, contentList.length === 0 && text, contentList.length && contentList);
    }, []);
}
exports.richStringParser = richStringParser;
