import { Match, Parser } from './parsers';
declare type MatchResults = Array<Match | string>;
export declare function richStringParser(text: string, parsers: Parser[]): MatchResults;
export {};
