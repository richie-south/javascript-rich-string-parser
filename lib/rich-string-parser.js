"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richStringParser = void 0;
function _runParserWithText(parser, text) {
    let contentList = [];
    const textLength = text.length;
    if (text == undefined || textLength === 0) {
        return [];
    }
    const match = parser.findMatch(text);
    if (match === null) {
        contentList.push(text);
        return contentList;
    }
    const firstPart = text.substring(0, match.index);
    if (firstPart.length > 0) {
        contentList.push(firstPart);
    }
    const lastPart = text.substring(match.index + match.value.length, textLength);
    contentList.push(parser.converter(match.value));
    contentList = [...contentList, ..._runParserWithText(parser, lastPart)];
    return contentList;
}
function _runParser(parser, text, list) {
    if (list != undefined && list.length > 0) {
        const _contentList = list;
        for (let listIndex = 0; listIndex < list.length; listIndex++) {
            const item = list[listIndex];
            if (typeof item === 'string') {
                const subList = _runParserWithText(parser, item);
                _contentList[listIndex] = subList;
            }
        }
        return _contentList.flat();
    }
    else if (text != undefined && text.length > 0) {
        return _runParserWithText(parser, text);
    }
    return [];
}
function richStringParser(text, parsers) {
    if (!text) {
        return [];
    }
    return parsers.reduce((contentList, parser) => {
        return _runParser(parser, contentList.length === 0 && text, contentList.length && contentList);
    }, []);
}
exports.richStringParser = richStringParser;
