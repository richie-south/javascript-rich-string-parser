export declare type Match<T = unknown> = {
    match: string;
    index: number;
    type: T;
    [key: string]: any;
};
export interface Parser<T = unknown> {
    parse: (text: string) => Match<T> | null;
}
export declare type MatchResults<T = unknown> = Array<Match<T> | string>;
