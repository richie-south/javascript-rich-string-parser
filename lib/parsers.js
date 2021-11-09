"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkParser = exports.emailParser = exports.mentionParser = void 0;
function mentionParser() {
    const regex = /@\(\d+\|(.+?)\)/;
    return {
        parse: (text) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            const match = result[0];
            return {
                type: 'MentionParser',
                match,
                index: result.index,
                id: Number(match.substring(2, match.indexOf('|'))),
                name: match.substring(match.indexOf('|') + 1, match.length - 1),
            };
        },
    };
}
exports.mentionParser = mentionParser;
function emailParser() {
    const regex = /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/i;
    return {
        parse: (text) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            return {
                type: 'EmailParser',
                match: result[0],
                index: result.index,
            };
        },
    };
}
exports.emailParser = emailParser;
function linkParser() {
    const regex = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/i;
    return {
        parse: (text) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            return {
                type: 'LinkParser',
                match: result[0],
                index: result.index,
            };
        },
    };
}
exports.linkParser = linkParser;
