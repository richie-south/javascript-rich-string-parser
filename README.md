# rich-string-parser

Finds rich text in strings, ex: links, mentions, emails, your own parser, in an non overlapping way to prevent dubble matching.

**Example**

```typescript
import {richStringParser, emailParser, linkParser} from 'rich-string-parser'

const result = richStringParser(
  'https://www.typescriptlang.org/ text example@example.com more text',
  [emailParser(), linkParser()],
)

// log result
/* [
  { type: 'LinkParser', match: 'https://www.typescriptlang.org/', index: 0 },
  ' text ',
  { type: 'EmailParser', match: 'example@example.com', index: 37 },
  ' more text'
] */
```

## Built in parsers

**MentionParser**

Matches on `@(number|string)`, @(9712|John)

Result:

```typescript
{
  type: 'MentionParser',
  match: '@(9712|John)',
  id: 9712,
  name: 'John',
  index: 0,
}
```

**EmailParser**

Matches on `example@example.com`,

Result:

```typescript
{
  type: 'EmailParser',
  match: 'example@example.com',
  index: 0,
}
```

**LinkParser**

Matches on `https://example.com`,

Result:

```typescript
{
  type: 'LinkParser',
  match: 'https://example.com',
  index: 0,
}
```

## Create your own parser

Create a function that retrurns a `Parser` interface with a custom string in generic type, example `Parser<'HashtagParser'>`.
Implemente the required return object with `findMatch` and `converter`.

In `findMatch` you recive string part where you can find a match in any way you want, regex, custom string manipulation or any other way.
You just need to return the index of your match and the match itself.

In `converter` you specify the structure of the return value from `richStringParser()`. `type` and `match` are required otherwise you can format it however you want.

**Example**

```typescript
function hashtagParser(): Parser<'HashtagParser'> {
  const regex: RegExp = /(#[a-z\d-]+)/gi

  return {
    parse: (text) => {
      const result = regex.exec(text)
      if (result === null) return null

      return {
        type: 'HashtagParser',
        match: result[0],
        index: result.index,
      }
    },
  }
}
```
