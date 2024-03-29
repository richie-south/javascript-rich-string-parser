"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkParser = void 0;
function linkParser() {
    const regex = /((?:https?):\/\/[^\s/$.?#].[^\s]*)/i;
    return {
        parse: (text, index) => {
            const result = regex.exec(text);
            if (result === null)
                return null;
            return {
                type: 'LinkParser',
                match: result[0],
                index: index + result.index,
                subIndex: result.index,
            };
        },
    };
}
exports.linkParser = linkParser;
