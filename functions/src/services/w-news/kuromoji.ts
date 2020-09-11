import {
  builder as kuromojiBuilder,
  Tokenizer,
  IpadicFeatures,
  TokenizerBuilder,
} from 'kuromoji';

export const torknize = async (text: string): Promise<IpadicFeatures[]> => {
  const builder: TokenizerBuilder<IpadicFeatures> = kuromojiBuilder({
    dicPath: 'node_modules/kuromoji/dict',
  });

  const tokenizer = new Promise<Tokenizer<IpadicFeatures>>((done) => {
    builder.build((_err, tokenizer) => {
      done(tokenizer);
    });
  });

  return (await tokenizer).tokenize(text);
};

export const extractNoun = (texts: IpadicFeatures[]): IpadicFeatures[] => {
  return (
    texts
      // 名詞の抽出
      .filter(
        (text) =>
          text.pos === '名詞' &&
          (text.pos_detail_1 === '固有名詞' || text.pos_detail_1 === '一般'),
      )
      // 同一IDの重複削除
      .filter(
        (text, i, texts) =>
          texts.findIndex((elm) => elm.word_id === text.word_id) === i,
      )
      // 同一単語の重複削除
      .filter(
        (text, i, texts) =>
          texts.findIndex((elm) => elm.surface_form === text.surface_form) ===
          i,
      )
  );
};
