export type Match<T = unknown> = {
  match: string
  type: 'MentionParser' | 'EmailParser' | 'LinkParser' | T
  [key: string]: any
}

export interface Parser<T = unknown> {
  findMatch: (text: string) => {
    value: string
    index: number
  } | null
  converter: (match: string) => Match<T>
}

export type MatchResults<T = unknown> = Array<Match<T> | string>
