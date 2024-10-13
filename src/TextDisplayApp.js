import React, { createElement, useState, useEffect } from "react";

function App() {
    const [difficulty, setDifficulty] = useState(1);
    const [testWords, setTestWords] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [wordsCorrect, setWordsCorrect] = useState(0);
    const [currentTypedWords, setCurrentTypedWords] = useState([]);
    const [timer, setTimer] = useState(60); // Timer for the test
    const [isTestRunning, setIsTestRunning] = useState(false); // Test running status
    const [hasStartedTyping, setHasStartedTyping] = useState(false); // Track if user has started typing

    useEffect(() => {
        displayTest(difficulty);
    }, [difficulty]);

    useEffect(() => {
        let interval = null;
        if (isTestRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTestRunning(false); // Stop the test when timer runs out
            setInputValue(''); // Clear input when test stops
        }
        return () => clearInterval(interval); // Clear interval on component unmount
    }, [isTestRunning, timer]);

    const displayTest = (diff) => {
        const newTest = randomWords(diff);
        setTestWords(newTest);
        setWordsCorrect(0);
        setInputValue('');
        setCurrentTypedWords([]);
        resetWordStyle(); // Reset styles whenever a new test is displayed
        setTimer(60); // Reset timer to 60 seconds
        setIsTestRunning(false); // Ensure the test is not running initially
        setHasStartedTyping(false); // Reset typing state
    };

    const handleInputChange = (event) => {
        const charEntered = event.target.value;
        setInputValue(charEntered);

        if (!hasStartedTyping) {
            setIsTestRunning(true); // Start the test on first input
            setHasStartedTyping(true); // Mark that the user has started typing
        }

        const wordsTyped = charEntered.trim().split(' '); // Split the sentence typed
        setCurrentTypedWords(wordsTyped);
        checkWords(wordsTyped);
    };

    const checkWords = (wordsTyped) => {
        // Loop through the typed words and compare with test words
        let correctCount = 0;

        wordsTyped.forEach((typedWord, index) => {
            const currentSpan = document.getElementById(`word-${index + 1}`);

            if (!currentSpan) return; // If no more test words exist

            const curSpanWord = currentSpan.innerText.trim();

            if (typedWord === curSpanWord) {
                currentSpan.classList.add('correct');
                currentSpan.classList.remove('wrong');
                correctCount += 1;
            } else if (typedWord.startsWith(curSpanWord.substring(0, typedWord.length))) {
                currentSpan.classList.remove('wrong');
                currentSpan.classList.add('current');
            } else {
                currentSpan.classList.add('wrong');
                currentSpan.classList.remove('current');
            }
        });

        setWordsCorrect(correctCount);
        // If the word number reaches 40, load new words
        if (wordsTyped.length >= 40) {
            loadNewWords();
        }
    };

    const loadNewWords = () => {
        const newTest = randomWords(difficulty); // Get new words
        setTestWords(newTest);
        setInputValue(''); // Clear input for the next test
        resetWordStyle(); // Reset styles for the new words
        // Do not update wordsCorrect here, let it be updated based on user input
    };

    const resetWordStyle = () => {
        const wordSpans = document.querySelectorAll(`[id^=word-]`);
        wordSpans.forEach((span) => {
            span.classList.remove('correct', 'wrong', 'current');
        });
    };

    const randomWords = (diff) => {
        const topWords = ['ability', 'able', 'about', 'your', 'yourself'];
        const basicWords = ['a', 'about', 'above', 'across'];
        const quotes = [
            'To be, or not to be.',
            'He said, "leave it with me."',
            'Life is what happens when you’re busy making other plans.',
            'In the end, we will remember not the words of our enemies, but the silence of our friends.',
            'The only limit to our realization of tomorrow is our doubts of today.'
        ];

        if (diff === 1) {
            // Select 40 random words from basicWords
            return Array.from({ length: 40 }, () => basicWords[Math.floor(Math.random() * basicWords.length)]);
        } else if (diff === 2) {
            // Select 40 random words from topWords
            return Array.from({ length: 40 }, () => topWords[Math.floor(Math.random() * topWords.length)]);
        } else if (diff === 3) {
            // Select 20 random quotes
            const selectedQuotes = Array.from({ length: 20 }, () => {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                return randomQuote.split(' '); // Split the quote into individual words
            });

            // Flatten the array of arrays into a single array
            return selectedQuotes.flat();
        }
    };

    return createElement(
        'div',
        { className: 'App' },
        createElement('h1', null, 'Typing Test'),
        createElement(
            'div',
            { id: 'textDisplay' },
            testWords.map((word, index) =>
                createElement('span', { key: index, id: `word-${index + 1}` }, `${word} `)
            )
        ),

        createElement('input', {
            type: 'text',
            value: inputValue,
            onChange: handleInputChange,
            id: 'textInput',
            // The input should always be enabled, so we remove this line:
            // disabled: !isTestRunning, 
        }),

        createElement(
            'button',
            { onClick: () => setDifficulty(1) },
            'Basic'
        ),

        createElement(
            'button',
            { onClick: () => setDifficulty(2) },
            'Advanced'
        ),

        createElement(
            'button',
            { onClick: () => setDifficulty(3) },
            'Quotes'
        ),

        createElement(
            'div',
            { className: 'status' },
            createElement('span', null, `Words Correct: ${wordsCorrect}`),
            createElement('span', null, ` | Time Remaining: ${timer} seconds`)
        )
    );
}

export default App;
