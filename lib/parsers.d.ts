import { Match, Parser } from './types';
export declare class MentionParser implements Parser {
    regex: RegExp;
    converter(mention: string): Match;
}
export declare class EmailParser implements Parser {
    regex: RegExp;
    converter(match: string): Match;
}
export declare class LinkParser implements Parser {
    regex: RegExp;
    converter(match: string): Match;
}
