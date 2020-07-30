import React, { useEffect, useState } from 'react';
import { getWords } from './api';
import { WordList } from './WordList';
import { WordInput } from './WordInput';
import { WordCheck } from './WordCheck';

export const App = () => {
  const [screen, setScreen] = useState('list');
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);

  useEffect(() => {
    refreshWords();
  }, []);

  const currentIndex = findIndexById(currentWord?.id);

  function findIndexById(id) {
    if (!id) return -1;
    return words.findIndex((i) => i.id === id);
  }

  async function refreshWords(id = undefined) {
    const words = await getWords();
    setWords(words);

    const index = findIndexById(id);
    setCurrentWord(index >= 0 ? words[index] : null);
  }

  function nextWord() {
    let index = currentIndex + 1;
    setCurrentByIndex(index);
  }

  function prevWord() {
    let index = currentIndex - 1;
    setCurrentByIndex(index);
  }

  function setCurrentByIndex(index) {
    if (index >= words.length) index = words.length - 1;
    if (index < 0) index = 0;
    setCurrentWord(words[index]);
  }

  const props = {
    words,
    currentIndex,
    currentWord,
    setScreen,
    setCurrentWord,
    refreshWords,
    prevWord,
    nextWord,
    isFirst: currentIndex <= 0,
    isLast: currentIndex >= words.length - 1,
  };

  return (
    <div>
      {screen === 'list' && <WordList {...props} />}
      {screen === 'input' && <WordInput {...props} />}
      {screen === 'check' && <WordCheck {...props} />}
    </div>
  );
};
