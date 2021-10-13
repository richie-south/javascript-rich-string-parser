"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkParser = exports.emailParser = exports.mentionParser = void 0;
function mentionParser() {
    const regex = /@\(\d+\|(.+?)\)/;
    return {
        findMatch: (text) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            return {
                value: result[0],
                index: result.index,
            };
        },
        converter: (mention) => {
            return {
                type: 'MentionParser',
                match: mention,
                id: Number(mention.substring(2, mention.indexOf('|'))),
                name: mention.substring(mention.indexOf('|') + 1, mention.length - 1),
            };
        },
    };
}
exports.mentionParser = mentionParser;
function emailParser() {
    const regex = /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/i;
    return {
        findMatch: (text) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            return {
                value: result[0],
                index: result.index,
            };
        },
        converter: (match) => {
            return {
                type: 'EmailParser',
                match,
            };
        },
    };
}
exports.emailParser = emailParser;
function linkParser() {
    const regex = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/i;
    return {
        findMatch: (text) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            return {
                value: result[0],
                index: result.index,
            };
        },
        converter: (match) => {
            return {
                type: 'LinkParser',
                match,
            };
        },
    };
}
exports.linkParser = linkParser;
