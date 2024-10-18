import React, { createElement, useState, useEffect } from 'react';

function App() {
  const [wordNo, setWordNo] = useState(1);
  const [wordsSubmitted, setWordsSubmitted] = useState(0);
  const [wordsCorrect, setWordsCorrect] = useState(0);
  const [timer, setTimer] = useState(30);
  const [flag, setFlag] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [testWords, setTestWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    displayTest(difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (timer === 0) {
      timeOver();
    }
  }, [timer]);

  // Handle input change
  const handleInputChange = (event) => {
    const charEntered = event.target.value;
    setInputValue(charEntered);

    if (flag === 0) {
      setFlag(1);
      timeStart();
    }

    if (/\s/g.test(event.nativeEvent.data)) {
      checkWord();
    } else {
      currentWord();
    }
  };

  // Start timer
  const timeStart = () => {
    setIntervalId(
      setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000)
    );
  };

  // Time over function
  const timeOver = () => {
    clearInterval(intervalId);
    displayScore();
  };

  // Display score
  const displayScore = () => {
    const percentageAcc = wordsSubmitted ? Math.floor((wordsCorrect / wordsSubmitted) * 100) : 0;
    alert(`Accuracy: ${percentageAcc}%\nWords per minute: ${wordsCorrect * 2}`);
  };

  // Check the current word
  const currentWord = () => {
    const currentSpan = document.getElementById(`word-${wordNo}`);
    const curSpanWord = currentSpan.innerText.trim();

    if (inputValue === curSpanWord.substring(0, inputValue.length)) {
      currentSpan.classList.add('current');
    } else {
      currentSpan.classList.add('wrong');
    }
  };

  // Check word when space is entered
  const checkWord = () => {
    const currentSpan = document.getElementById(`word-${wordNo}`);
    const curSpanWord = currentSpan.innerText.trim();

    setWordsSubmitted(wordsSubmitted + 1);
    setInputValue('');

    if (inputValue.trim() === curSpanWord) {
      currentSpan.classList.add('correct');
      setWordsCorrect(wordsCorrect + 1);
    } else {
      currentSpan.classList.add('wrong');
    }

    setWordNo(wordNo + 1);
    if (wordNo > 40) {
      displayTest(difficulty);
    }
  };

  // Restart the test
  const restartTest = () => {
    clearInterval(intervalId);
    setWordNo(1);
    setWordsSubmitted(0);
    setWordsCorrect(0);
    setFlag(0);
    setTimer(difficulty === 1 ? 30 : 60);
    setInputValue('');
    displayTest(difficulty);
  };

  // Display random words
  const displayTest = (diff) => {
    const newTest = randomWords(diff);
    setTestWords(newTest);
  };

  // Generate random words
  const randomWords = (diff) => {
    const topWords = ['ability', 'able', 'about', 'your', 'yourself'];
    const basicWords = ['a', 'about', 'above', 'across'];

    const wordArray = diff === 1 ? basicWords : topWords;
    const selectedWords = [];
    for (let i = 0; i < 40; i++) {
      const randomNumber = Math.floor(Math.random() * wordArray.length);
      selectedWords.push(wordArray[randomNumber]);
    }
    return selectedWords;
  };

  // Create elements programmatically
  const createElement = (type, props = {}, ...children) => {
    return React.createElement(type, props, ...children);
  };

  return createElement(
    'div',
    { className: 'App' },
    createElement('h1', null, 'Typing Test'),
    createElement(
      'div',
      { id: 'testDisplay' },
      testWords.map((word, index) =>
        createElement('span', { key: index, id: `word-${index + 1}` }, `${word} `)
      )
    ),
    createElement('input', {
      type: 'text',
      value: inputValue,
      onChange: handleInputChange,
      id: 'textInput',
      disabled: timer <= 0,
    }),
    createElement(
      'div',
      { className: 'controls' },
      createElement(
        'button',
        { onClick: () => setTimer(30) },
        '30 seconds'
      ),
      createElement(
        'button',
        { onClick: () => setTimer(60) },
        '60 seconds'
      ),
      createElement(
        'button',
        { onClick: () => setDifficulty(1) },
        'Beginner'
      ),
      createElement(
        'button',
        { onClick: () => setDifficulty(2) },
        'Pro'
      ),
      createElement(
        'button',
        { onClick: restartTest },
        'Restart'
      )
    ),
    createElement(
      'div',
      { className: 'status' },
      createElement('span', null, `Time: ${timer}`),
      createElement('span', null, `Words Correct: ${wordsCorrect}`)
    )
  );
}

// Default export
export default App;
