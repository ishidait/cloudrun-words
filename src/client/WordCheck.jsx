import React from 'react';
import { languageList } from './constants';
import { updateDone } from './api';

export function WordCheck({
  setScreen,
  words,
  currentIndex,
  currentWord,
  refreshWords,
  prevWord,
  nextWord,
  isFirst,
  isLast,
  idToken,
}) {
  async function handleDone() {
    const word = { ...currentWord, done: currentWord.done ? 0 : 1 };
    try {
      await updateDone(idToken, word);
      await refreshWords(currentWord.id);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function handleBack() {
    refreshWords();
    setScreen('list');
  }

  return (
    <div className="screen check">
      <h2>
        {currentIndex + 1}/{words.length}{' '}
        <span className="done-check">{currentWord.done ? '✔' : ''}</span>
      </h2>

      <div className="input-form">
        {languageList.map((i, index) => (
          <div className="row" key={i.lang}>
            <label>{i.name}</label>
            <span>{currentWord[i.lang]}</span>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button type="button" onClick={handleBack}>
          戻る
        </button>
        <button type="button" onClick={prevWord} disabled={isFirst}>
          &lt; 前へ
        </button>
        <button type="button" onClick={handleDone}>
          {currentWord.done ? '忘れた' : '覚えた！'}
        </button>
        <button type="button" onClick={nextWord} disabled={isLast}>
          次へ &gt;
        </button>
      </div>
    </div>
  );
}
