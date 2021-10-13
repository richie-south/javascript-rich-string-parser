export declare type Match = {
    match: string;
    type: 'MentionParser' | 'EmailParser' | 'LinkParser';
    [key: string]: any;
};
export interface Parser {
    findMatch: (text: string) => {
        value: string;
        index: number;
    } | null;
    converter: (match: string) => Match;
}
export declare type MatchResults = Array<Match | string>;
