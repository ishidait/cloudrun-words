export const languageList = [
  { lang: 'ja', name: '日本語' },
  { lang: 'en', name: '英語' },
  { lang: 'es', name: 'スペイン語' },
  { lang: 'fr', name: 'フランス語' },
];

export const languages = languageList.map((i) => ({ [i.lang]: i.name }));
