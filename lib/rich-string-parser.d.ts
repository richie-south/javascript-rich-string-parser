import { MatchResults, Parser } from './types';
export declare function richStringParser<T>(text: string, parsers: Parser<T>[]): MatchResults<T>;
