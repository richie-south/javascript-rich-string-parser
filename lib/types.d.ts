export declare type Match<T = unknown> = {
    match: string;
    index: number;
    subIndex: number;
    type: T;
    [key: string]: any;
};
export interface Parser<T = unknown> {
    parse: (text: string, index: number) => Match<T> | null;
}
export declare type MatchResults<T = unknown> = Array<Match<T> | string>;
