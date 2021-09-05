# rich-string-parser

Finds rich text in strings, ex: links, mentions, emails

```typescript
const parsedString = richStringParser(
  'https://www.typescriptlang.org/ text example@example.com more text',
  [new EmailParser(), new LinkParser()],
)

// content of parsedString
/* [
  { type: 'LinkParser', match: 'https://www.typescriptlang.org/' },
  ' text ',
  { type: 'EmailParser', match: 'example@example.com' },
  ' more text'
] */
```

Now you can loop over your parsed content and display content in a structured way without conflicts.
