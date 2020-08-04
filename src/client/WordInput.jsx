import React, { useState } from 'react';
import { languageList } from './constants';
import { translate, saveWord, validate } from './api';

export function WordInput({ setScreen, currentWord, refreshWords, idToken }) {
  const [wordState, setWordState] = useState(() => {
    const initialState = {
      id: currentWord ? currentWord.id : undefined,
      done: currentWord ? currentWord.done : false,
    };
    for (const i of languageList) {
      initialState[i.lang] = currentWord ? currentWord[i.lang] : '';
    }
    return initialState;
  });

  const isValid = !validate(wordState);

  function handleInputChange(e) {
    const input = e.target;
    const lang = input.getAttribute('name');
    const w = {
      ...wordState,
      [lang]: input.value.trim(),
    };
    setWordState(w);
  }

  async function handleTranslate(e) {
    e.preventDefault();
    const lang = e.target.dataset.lang;
    const value = wordState[lang];
    if (!value) return;

    const result = await translate(idToken, lang, value);
    const w = {
      ...wordState,
      ...result,
    };
    setWordState(w);
  }

  async function handleSave() {
    const word = { ...wordState };
    try {
      await saveWord(idToken, word);
      refreshWords();
      setScreen('list');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="screen input">
      <h2>{currentWord ? '編集' : '登録'}</h2>

      <div className="input-form">
        {languageList.map((i, index) => (
          <div className="row" key={i.lang}>
            <label htmlFor={`txt_${i.lang}`}>{i.name}</label>
            <div className="text-with-button">
              <input
                type="text"
                name={i.lang}
                id={`txt_${i.lang}`}
                value={wordState[i.lang]}
                onChange={handleInputChange}
                autoFocus={index === 0}
                autoComplete="off"
                maxLength="200"
              />
              <button
                className="small"
                onClick={handleTranslate}
                data-lang={i.lang}
                disabled={!wordState[i.lang]}
              >
                翻訳
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button type="button" onClick={() => setScreen('list')}>
          戻る
        </button>
        <button type="button" onClick={handleSave} disabled={!isValid}>
          保存
        </button>
      </div>
    </div>
  );
}
