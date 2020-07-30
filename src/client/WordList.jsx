import React, { useEffect } from 'react';
import { deleteWord } from './api';
import { WordListItem } from './WordListItem';

export function WordList({ words, setScreen, setCurrentWord, refreshWords }) {
  useEffect(() => {
    if (words.length === 0) {
      refreshWords();
    }
  }, []);

  function handleInput() {
    setCurrentWord(null);
    setScreen('input');
  }

  function handleCheck() {
    setCurrentWord(words[0]);
    setScreen('check');
  }

  async function handleEdit(e) {
    e.preventDefault();
    const id = e.target.dataset.id | 0;
    const word = words.find((i) => i.id === id);
    setCurrentWord(word);
    setScreen('input');
  }

  async function handleDelete(e) {
    e.preventDefault();
    if (!confirm('削除しますか?')) return;
    const id = e.target.dataset.id | 0;
    const result = await deleteWord(id);
    console.log({ result });
    await refreshWords();
  }

  return (
    <div className="screen list">
      <h2>単語一覧</h2>
      {words.length > 0 ? <p>単語数：{words.length}</p> : null}
      <ol className="word-list">
        {words.map((w, index) => (
          <WordListItem
            key={w.id}
            index={index}
            word={w}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ol>
      <div className="buttons">
        <button type="button" onClick={handleInput}>
          登 録
        </button>
        <button
          type="button"
          onClick={handleCheck}
          disabled={words.length <= 0}
        >
          チェック
        </button>
      </div>
    </div>
  );
}
