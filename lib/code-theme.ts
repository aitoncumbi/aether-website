import type { ThemeRegistration } from 'shiki';

/** Syntax colours in the site's palette: greys and white, with cyan for strings and numbers. */
function aether(type: 'dark' | 'light', c: Record<string, string>): ThemeRegistration {
  return {
    name: `aether-${type}`,
    type,
    colors: { 'editor.background': c.bg, 'editor.foreground': c.fg },
    tokenColors: [
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: c.comment, fontStyle: 'italic' },
      },
      { scope: ['string', 'string.quoted', 'markup.inline.raw'], settings: { foreground: c.string } },
      { scope: ['keyword', 'storage', 'keyword.operator.word'], settings: { foreground: c.keyword } },
      {
        scope: ['constant', 'constant.numeric', 'constant.language', 'support.constant'],
        settings: { foreground: c.number },
      },
      { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: c.fn } },
      {
        scope: ['entity.name.type', 'support.type', 'entity.name.class', 'entity.name.tag'],
        settings: { foreground: c.type },
      },
      {
        scope: ['variable', 'variable.parameter', 'support.variable', 'entity.other.attribute-name'],
        settings: { foreground: c.variable },
      },
      { scope: ['punctuation', 'keyword.operator', 'meta.brace'], settings: { foreground: c.punct } },
    ],
  };
}

export const aetherDark = aether('dark', {
  bg: '#0a0a0a',
  fg: '#e5e5e5',
  comment: '#737373',
  string: '#9ff4ff',
  keyword: '#ffffff',
  number: '#7dd3fc',
  fn: '#d4d4d4',
  type: '#a5f3fc',
  variable: '#e5e5e5',
  punct: '#8a8a8a',
});

export const aetherLight = aether('light', {
  bg: '#fafafa',
  fg: '#171717',
  comment: '#737373',
  string: '#0e7490',
  keyword: '#000000',
  number: '#0369a1',
  fn: '#262626',
  type: '#155e75',
  variable: '#171717',
  punct: '#525252',
});
