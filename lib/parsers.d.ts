export declare type Match = {
    match: string;
    type: 'MentionParser' | 'EmailParser' | 'LinkParser' | string;
    [key: string]: any;
};
export interface Parser {
    regex: RegExp;
    converter: (match: string) => Match;
}
export declare class MentionParser {
    regex: RegExp;
    converter(mention: string): Match;
}
export declare class EmailParser implements Parser {
    regex: RegExp;
    converter(match: string): {
        type: string;
        match: string;
    };
}
export declare class LinkParser implements Parser {
    regex: RegExp;
    converter(match: string): Match;
}
