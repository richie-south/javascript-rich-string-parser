"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentionParser = void 0;
function mentionParser() {
    const regex = /@\(\d+\|(.+?)\)/;
    return {
        parse: (text, index) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            const match = result[0];
            return {
                type: 'MentionParser',
                match,
                index: index + result.index,
                subIndex: result.index,
                id: Number(match.substring(2, match.indexOf('|'))),
                name: match.substring(match.indexOf('|') + 1, match.length - 1),
            };
        },
    };
}
exports.mentionParser = mentionParser;
