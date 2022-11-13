import {richStringParser} from './index'
import {emailParser} from './parsers/email-parser'
import {linkParser} from './parsers/link-parser'
import {mentionParser} from './parsers/mention-parser'

describe('Mention parser', () => {
  it('find mention', () => {
    const string = 'Hello @(123|richard) whats up?'
    const result = richStringParser(string, [mentionParser()])

    expect(result.length).toEqual(3)
    expect(result[1]).toHaveProperty('id', 123)
    expect(result[1]).toHaveProperty('type', 'MentionParser')
    expect(result[1]).toHaveProperty('match', '@(123|richard)')
    expect(result[1]).toHaveProperty('name', 'richard')
    expect(result).toEqual([
      'Hello ',
      {
        type: 'MentionParser',
        id: 123,
        match: '@(123|richard)',
        index: 6,
        subIndex: 6,
        name: 'richard',
      },
      ' whats up?',
    ])
  })

  it('find all mentions', () => {
    const string = ' asd @(123|richard)@(123|richard) asd @(456|erik) hej'
    const result = richStringParser(string, [mentionParser()])

    expect(result.length).toEqual(6)
    expect(result).toEqual([
      ' asd ',
      {
        type: 'MentionParser',
        match: '@(123|richard)',
        id: 123,
        index: 5,
        subIndex: 5,
        name: 'richard',
      },
      {
        type: 'MentionParser',
        match: '@(123|richard)',
        id: 123,
        index: 19,
        subIndex: 0,
        name: 'richard',
      },
      ' asd ',
      {
        type: 'MentionParser',
        match: '@(456|erik)',
        id: 456,
        index: 38,
        subIndex: 5,
        name: 'erik',
      },
      ' hej',
    ])
  })
})

describe('Email parser', () => {
  it('Should find email', () => {
    const string = ' asd richard@gmail.com asd '
    const result = richStringParser(string, [emailParser()])

    expect(result.length).toEqual(3)
    expect(result).toEqual([
      ' asd ',
      {
        type: 'EmailParser',
        index: 5,
        subIndex: 5,
        match: 'richard@gmail.com',
      },
      ' asd ',
    ])
  })

  it('Should find all emails', () => {
    const string = ' asd richard@gmail.com asd@asd.com asd test@test.se '
    const result = richStringParser(string, [emailParser()])

    expect(result.length).toEqual(7)
    expect(result).toEqual([
      ' asd ',
      {type: 'EmailParser', index: 5, subIndex: 5, match: 'richard@gmail.com'},
      ' ',
      {type: 'EmailParser', index: 23, subIndex: 1, match: 'asd@asd.com'},
      ' asd ',
      {type: 'EmailParser', index: 39, subIndex: 5, match: 'test@test.se'},
      ' ',
    ])
  })
})

describe('Link parser', () => {
  it('Should find link', () => {
    const string = ' asd https://plantr.online asd '
    const result = richStringParser(string, [linkParser()])

    expect(result.length).toEqual(3)
    expect(result).toEqual([
      ' asd ',
      {
        type: 'LinkParser',
        index: 5,
        subIndex: 5,
        match: 'https://plantr.online',
      },
      ' asd ',
    ])
  })

  it('Should find all links', () => {
    const string =
      ' asd http://richardsoderman.se asd https://plantr.online hej'
    const result = richStringParser(string, [linkParser()])

    expect(result.length).toEqual(5)
    expect(result).toEqual([
      ' asd ',
      {
        type: 'LinkParser',
        index: 5,
        subIndex: 5,
        match: 'http://richardsoderman.se',
      },
      ' asd ',
      {
        type: 'LinkParser',
        index: 35,
        subIndex: 5,
        match: 'https://plantr.online',
      },
      ' hej',
    ])
  })
})

describe('Multible parsers', () => {
  it('Should find email, links and mentions in same string', () => {
    const string =
      'Lorem @(456|example) ipsum example@gmail.com http://example.com hello https://www.google.com @(123|example)'
    const result = richStringParser(string, [
      linkParser(),
      mentionParser(),
      emailParser(),
    ])

    expect(result.length).toEqual(10)
    expect(result).toEqual([
      'Lorem ',
      {
        type: 'MentionParser',
        match: '@(456|example)',
        id: 456,
        index: 6,
        subIndex: 6,
        name: 'example',
      },
      ' ipsum ',
      {type: 'EmailParser', index: 27, subIndex: 7, match: 'example@gmail.com'},
      ' ',
      {
        type: 'LinkParser',
        index: 45,
        subIndex: 45,
        match: 'http://example.com',
      },
      ' hello ',
      {
        type: 'LinkParser',
        index: 70,
        subIndex: 7,
        match: 'https://www.google.com',
      },
      ' ',
      {
        type: 'MentionParser',
        match: '@(123|example)',
        id: 123,
        index: 93,
        subIndex: 1,
        name: 'example',
      },
    ])
  })
})

describe('No matches', () => {
  it('Should not find any matches', () => {
    const string =
      'Lorem ipsum dolor sit amet consectetur adipiscing, elit tellus est @ accumsan habitasse.tempus , libero per curae condimentum etiam. @'
    const result = richStringParser(string, [
      linkParser(),
      mentionParser(),
      emailParser(),
    ])

    expect(result.length).toEqual(1)
    expect(result).toEqual([
      'Lorem ipsum dolor sit amet consectetur adipiscing, elit tellus est @ accumsan habitasse.tempus , libero per curae condimentum etiam. @',
    ])
  })
})

describe('Preformance', () => {
  it('Should not take to long time', () => {
    const string =
      'Lorem http://example.com ipsum dolor example@example.com sit amet http://example.com consectetur adipiscing elit mi @(1235|asdf) habitasse enim, quam pharetra tempor ligula example@example.com venenatis nec dis http://example.com vulputate morbi example@example.com , neque dictum nisl lacinia curae cras example@example2.com @(1235|asdf) orci natoque feugiat. Sociosqu bibendum augue potenti sapien integer http://example.com http://example.com http://example.com http://example.com http://example.com dui hendrerit non ac magnis gravida, cubilia example@example3.com turpis mattis ut eleifend facilisis @(1235|asdf) auctor urna http://example.com ante inceptos dignissim, torquent nulla consequat example@example5.com sed hac tellus http://example.com magna malesuada praesent interdum. Ridiculus @(1235|asdf) vel nunc elementum http://example.com ullamcorper varius accumsan fusce, rhoncus nostra pulvinar http://example.com eros molestie tortor, vestibulum convallis libero commodo faucibus mus. Est http://example.com nisi per scelerisque leo a vivamus http://example.com ultrices conubia example@example.com ornare @(1235|asdf) example@example.com montes curabitur facilisi, pretium sociis odio et posuere imperdiet penatibus condimentum nam senectus arcu aliquam, http://example.com quisque risus @(1235|asdf) diam class nascetur mauris suspendisse lacus porta metus semper. Ad aptent cursus ultricies aenean volutpat netus, dictumst etiam duis @(1235|asdf) in massa eu tristique, euismod http://example.com fames example@example.com primis egestas maecenas. Erat sem himenaeos porttitor proin pellentesque viverra dapibus lectus @(1235|asdf) congue sollicitudin, litora eget placerat id quis phasellus nullam sodales tincidunt, fermentum http://example.com iaculis felis @(1235|asdf) taciti donec vitae suscipit cum lobortis. example@example.com At parturient aliquet vehicula nibh example@example.com laoreet velit tempus sagittis justo, example@example.com luctus fringilla purus @(1235|asdf) platea rutrum mollis example@example.com blandit. Habitant phasellus dictum dui iaculis sed example@example.com integer netus litora, elementum @(1235|asdf) @(1235|asdf) purus fringilla example@example.com eget venenatis quisque eu, mauris suscipit viverra pharetra a sagittis http://example.com eleifend. Arcu nisi nunc non cursus condimentum nec hendrerit mattis velit, @(1235|asdf) ante auctor turpis massa platea http://example.com consequat taciti neque vehicula tempor, egestas maecenas odio @(1235|asdf) felis etiam http://example.com proin nascetur imperdiet @(1235|asdf). Lorem http://example.com ipsum dolor example@example.com sit amet http://example.com consectetur adipiscing elit mi @(1235|asdf) habitasse enim, quam pharetra tempor ligula example@example.com venenatis nec dis http://example.com vulputate morbi example@example.com , neque dictum nisl lacinia curae cras example@example2.com @(1235|asdf) orci natoque feugiat. Sociosqu bibendum augue potenti sapien integer http://example.com http://example.com http://example.com http://example.com http://example.com dui hendrerit non ac magnis gravida, cubilia example@example3.com turpis mattis ut eleifend facilisis @(1235|asdf) auctor urna http://example.com ante inceptos dignissim, torquent nulla consequat example@example5.com sed hac tellus http://example.com magna malesuada praesent interdum. Ridiculus @(1235|asdf) vel nunc elementum http://example.com ullamcorper varius accumsan fusce, rhoncus nostra pulvinar http://example.com eros molestie tortor, vestibulum convallis libero commodo faucibus mus. Est http://example.com nisi per scelerisque leo a vivamus http://example.com ultrices conubia example@example.com ornare @(1235|asdf) example@example.com montes curabitur facilisi, pretium sociis odio et posuere imperdiet penatibus condimentum nam senectus arcu aliquam, http://example.com quisque risus @(1235|asdf) diam class nascetur mauris suspendisse lacus porta metus semper. Ad aptent cursus ultricies aenean volutpat netus, dictumst etiam duis @(1235|asdf) in massa eu tristique, euismod http://example.com fames example@example.com primis egestas maecenas. Erat sem himenaeos porttitor proin pellentesque viverra dapibus lectus @(1235|asdf) congue sollicitudin, litora eget placerat id quis phasellus nullam sodales tincidunt, fermentum http://example.com iaculis felis @(1235|asdf) taciti donec vitae suscipit cum lobortis. example@example.com At parturient aliquet vehicula nibh example@example.com laoreet velit tempus sagittis justo, example@example.com luctus fringilla purus @(1235|asdf) platea rutrum mollis example@example.com blandit. Habitant phasellus dictum dui iaculis sed example@example.com integer netus litora, elementum @(1235|asdf) @(1235|asdf) purus fringilla example@example.com eget venenatis quisque eu, mauris suscipit viverra pharetra a sagittis http://example.com eleifend. Arcu nisi nunc non cursus condimentum nec hendrerit mattis velit, @(1235|asdf) ante auctor turpis massa platea http://example.com consequat taciti neque vehicula tempor, egestas maecenas odio @(1235|asdf) felis etiam http://example.com proin nascetur imperdiet @(1235|asdf). Lorem http://example.com ipsum dolor example@example.com sit amet http://example.com consectetur adipiscing elit mi @(1235|asdf) habitasse enim, quam pharetra tempor ligula example@example.com venenatis nec dis http://example.com vulputate morbi example@example.com , neque dictum nisl lacinia curae cras example@example2.com @(1235|asdf) orci natoque feugiat. Sociosqu bibendum augue potenti sapien integer http://example.com http://example.com http://example.com http://example.com http://example.com dui hendrerit non ac magnis gravida, cubilia example@example3.com turpis mattis ut eleifend facilisis @(1235|asdf) auctor urna http://example.com ante inceptos dignissim, torquent nulla consequat example@example5.com sed hac tellus http://example.com magna malesuada praesent interdum. Ridiculus @(1235|asdf) vel nunc elementum http://example.com ullamcorper varius accumsan fusce, rhoncus nostra pulvinar http://example.com eros molestie tortor, vestibulum convallis libero commodo faucibus mus. Est http://example.com nisi per scelerisque leo a vivamus http://example.com ultrices conubia example@example.com ornare @(1235|asdf) example@example.com montes curabitur facilisi, pretium sociis odio et posuere imperdiet penatibus condimentum nam senectus arcu aliquam, http://example.com quisque risus @(1235|asdf) diam class nascetur mauris suspendisse lacus porta metus semper. Ad aptent cursus ultricies aenean volutpat netus, dictumst etiam duis @(1235|asdf) in massa eu tristique, euismod http://example.com fames example@example.com primis egestas maecenas. Erat sem himenaeos porttitor proin pellentesque viverra dapibus lectus @(1235|asdf) congue sollicitudin, litora eget placerat id quis phasellus nullam sodales tincidunt, fermentum http://example.com iaculis felis @(1235|asdf) taciti donec vitae suscipit cum lobortis. example@example.com At parturient aliquet vehicula nibh example@example.com laoreet velit tempus sagittis justo, example@example.com luctus fringilla purus @(1235|asdf) platea rutrum mollis example@example.com blandit. Habitant phasellus dictum dui iaculis sed example@example.com integer netus litora, elementum @(1235|asdf) @(1235|asdf) purus fringilla example@example.com eget venenatis quisque eu, mauris suscipit viverra pharetra a sagittis http://example.com eleifend. Arcu nisi nunc non cursus condimentum nec hendrerit mattis velit, @(1235|asdf) ante auctor turpis massa platea http://example.com consequat taciti neque vehicula tempor, egestas maecenas odio @(1235|asdf) felis etiam http://example.com proin nascetur imperdiet @(1235|asdf). Lorem http://example.com ipsum dolor example@example.com sit amet http://example.com consectetur adipiscing elit mi @(1235|asdf) habitasse enim, quam pharetra tempor ligula example@example.com venenatis nec dis http://example.com vulputate morbi example@example.com , neque dictum nisl lacinia curae cras example@example2.com @(1235|asdf) orci natoque feugiat. Sociosqu bibendum augue potenti sapien integer http://example.com http://example.com http://example.com http://example.com http://example.com dui hendrerit non ac magnis gravida, cubilia example@example3.com turpis mattis ut eleifend facilisis @(1235|asdf) auctor urna http://example.com ante inceptos dignissim, torquent nulla consequat example@example5.com sed hac tellus http://example.com magna malesuada praesent interdum. Ridiculus @(1235|asdf) vel nunc elementum http://example.com ullamcorper varius accumsan fusce, rhoncus nostra pulvinar http://example.com eros molestie tortor, vestibulum convallis libero commodo faucibus mus. Est http://example.com nisi per scelerisque leo a vivamus http://example.com ultrices conubia example@example.com ornare @(1235|asdf) example@example.com montes curabitur facilisi, pretium sociis odio et posuere imperdiet penatibus condimentum nam senectus arcu aliquam, http://example.com quisque risus @(1235|asdf) diam class nascetur mauris suspendisse lacus porta metus semper. Ad aptent cursus ultricies aenean volutpat netus, dictumst etiam duis @(1235|asdf) in massa eu tristique, euismod http://example.com fames example@example.com primis egestas maecenas. Erat sem himenaeos porttitor proin pellentesque viverra dapibus lectus @(1235|asdf) congue sollicitudin, litora eget placerat id quis phasellus nullam sodales tincidunt, fermentum http://example.com iaculis felis @(1235|asdf) taciti donec vitae suscipit cum lobortis. example@example.com At parturient aliquet vehicula nibh example@example.com laoreet velit tempus sagittis justo, example@example.com luctus fringilla purus @(1235|asdf) platea rutrum mollis example@example.com blandit. Habitant phasellus dictum dui iaculis sed example@example.com integer netus litora, elementum @(1235|asdf) @(1235|asdf) purus fringilla example@example.com eget venenatis quisque eu, mauris suscipit viverra pharetra a sagittis http://example.com eleifend. Arcu nisi nunc non cursus condimentum nec hendrerit mattis velit, @(1235|asdf) ante auctor turpis massa platea http://example.com consequat taciti neque vehicula tempor, egestas maecenas odio @(1235|asdf) felis etiam http://example.com proin nascetur imperdiet @(1235|asdf). Lorem http://example.com ipsum dolor example@example.com sit amet http://example.com consectetur adipiscing elit mi @(1235|asdf) habitasse enim, quam pharetra tempor ligula example@example.com venenatis nec dis http://example.com vulputate morbi example@example.com , neque dictum nisl lacinia curae cras example@example2.com @(1235|asdf) orci natoque feugiat. Sociosqu bibendum augue potenti sapien integer http://example.com http://example.com http://example.com http://example.com http://example.com dui hendrerit non ac magnis gravida, cubilia example@example3.com turpis mattis ut eleifend facilisis @(1235|asdf) auctor urna http://example.com ante inceptos dignissim, torquent nulla consequat example@example5.com sed hac tellus http://example.com magna malesuada praesent interdum. Ridiculus @(1235|asdf) vel nunc elementum http://example.com ullamcorper varius accumsan fusce, rhoncus nostra pulvinar http://example.com eros molestie tortor, vestibulum convallis libero commodo faucibus mus. Est http://example.com nisi per scelerisque leo a vivamus http://example.com ultrices conubia example@example.com ornare @(1235|asdf) example@example.com montes curabitur facilisi, pretium sociis odio et posuere imperdiet penatibus condimentum nam senectus arcu aliquam, http://example.com quisque risus @(1235|asdf) diam class nascetur mauris suspendisse lacus porta metus semper. Ad aptent cursus ultricies aenean volutpat netus, dictumst etiam duis @(1235|asdf) in massa eu tristique, euismod http://example.com fames example@example.com primis egestas maecenas. Erat sem himenaeos porttitor proin pellentesque viverra dapibus lectus @(1235|asdf) congue sollicitudin, litora eget placerat id quis phasellus nullam sodales tincidunt, fermentum http://example.com iaculis felis @(1235|asdf) taciti donec vitae suscipit cum lobortis. example@example.com At parturient aliquet vehicula nibh example@example.com laoreet velit tempus sagittis justo, example@example.com luctus fringilla purus @(1235|asdf) platea rutrum mollis example@example.com blandit. Habitant phasellus dictum dui iaculis sed example@example.com integer netus litora, elementum @(1235|asdf) @(1235|asdf) purus fringilla example@example.com eget venenatis quisque eu, mauris suscipit viverra pharetra a sagittis http://example.com eleifend. Arcu nisi nunc non cursus condimentum nec hendrerit mattis velit, @(1235|asdf) ante auctor turpis massa platea http://example.com consequat taciti neque vehicula tempor, egestas maecenas odio @(1235|asdf) felis etiam http://example.com proin nascetur imperdiet @(1235|asdf).'
    const beforeDate = new Date()
    richStringParser(string, [emailParser(), linkParser(), mentionParser()])
    const afterDate = new Date()

    const time = afterDate.getTime() - beforeDate.getTime()

    expect(time).toBeLessThanOrEqual(8)
  })
})

describe('index', () => {
  it('Should calculate index based on whole string when using single parser', () => {
    const string =
      'jag vill att @(123|asd) ska göra något kul men @(456|fgh) ska inte var för bra'
    const result = richStringParser(string, [mentionParser()])

    expect(result).toEqual([
      'jag vill att ',
      {
        type: 'MentionParser',
        match: '@(123|asd)',
        index: 13,
        subIndex: 13,
        id: 123,
        name: 'asd',
      },
      ' ska göra något kul men ',
      {
        type: 'MentionParser',
        match: '@(456|fgh)',
        index: 47, // 24
        subIndex: 24,
        id: 456,
        name: 'fgh',
      },
      ' ska inte var för bra',
    ])
  })

  it('Should calculate index based on whole string when using two parsers', () => {
    const string =
      'jag vill att @(123|asd) ska göra asd@kingen.se något kul men @(456|fgh) ska inte var för bra'
    const result = richStringParser(string, [mentionParser(), emailParser()])

    expect(result).toEqual([
      'jag vill att ',
      {
        type: 'MentionParser',
        match: '@(123|asd)',
        index: 13,
        subIndex: 13,
        id: 123,
        name: 'asd',
      },
      ' ska göra ',
      {
        type: 'EmailParser',
        match: 'asd@kingen.se',
        index: 33,
        subIndex: 10,
      },
      ' något kul men ',
      {
        type: 'MentionParser',
        match: '@(456|fgh)',
        index: 61,
        subIndex: 38,
        id: 456,
        name: 'fgh',
      },
      ' ska inte var för bra',
    ])
  })

  it('Should calculate index based on whole string when using multible parsers', () => {
    const string =
      'jag vill https://google.com att @(123|asd) ska göra asd@kingen.se något kul men @(456|fgh) ska https://google.com inte var för bra'
    const result = richStringParser(string, [
      mentionParser(),
      emailParser(),
      linkParser(),
    ])

    expect(result).toEqual([
      'jag vill ',
      {
        type: 'LinkParser',
        match: 'https://google.com',
        index: 9,
        subIndex: 9,
      },
      ' att ',
      {
        type: 'MentionParser',
        match: '@(123|asd)',
        index: 32,
        subIndex: 32,
        id: 123,
        name: 'asd',
      },
      ' ska göra ',
      {
        type: 'EmailParser',
        match: 'asd@kingen.se',
        index: 52,
        subIndex: 10,
      },
      ' något kul men ',
      {
        type: 'MentionParser',
        match: '@(456|fgh)',
        index: 80,
        subIndex: 38,
        id: 456,
        name: 'fgh',
      },
      ' ska ',
      {
        type: 'LinkParser',
        match: 'https://google.com',
        index: 95,
        subIndex: 5,
      },
      ' inte var för bra',
    ])
  })
})
