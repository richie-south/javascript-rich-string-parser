"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkParser = exports.EmailParser = exports.MentionParser = void 0;
class MentionParser {
    constructor() {
        this.regex = /@\(\d+\|(.+?)\)/;
    }
    converter(mention) {
        return {
            type: 'MentionParser',
            match: mention,
            id: Number(mention.substring(2, mention.indexOf('|'))),
            name: mention.substring(mention.indexOf('|') + 1, mention.length - 1),
        };
    }
}
exports.MentionParser = MentionParser;
class EmailParser {
    constructor() {
        this.regex = /([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,16})/i;
    }
    converter(match) {
        return {
            type: 'EmailParser',
            match,
        };
    }
}
exports.EmailParser = EmailParser;
class LinkParser {
    constructor() {
        this.regex = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/i;
    }
    converter(match) {
        return {
            type: 'LinkParser',
            match,
        };
    }
}
exports.LinkParser = LinkParser;
