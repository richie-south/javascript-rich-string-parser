"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailParser = void 0;
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
