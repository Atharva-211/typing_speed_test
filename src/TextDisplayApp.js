import React, { createElement, useState, useEffect } from "react";

function App() {
    const [difficulty, setDifficulty] = useState(1);
    const [testWords, setTestWords] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [wordsCorrect, setWordsCorrect] = useState(0);
    const [totalWordsTyped, setTotalWordsTyped] = useState(0); // New state for total words typed
    const [currentTypedWords, setCurrentTypedWords] = useState([]);
    const [timer, setTimer] = useState(60); // Timer for the test
    const [isTestRunning, setIsTestRunning] = useState(false); // Test running status
    const [hasStartedTyping, setHasStartedTyping] = useState(false); // Track if user has started typing
    const [testDuration, setTestDuration] = useState(60); // Default duration is 60 seconds

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
        setTimer(testDuration); // Reset timer to the selected duration
        setIsTestRunning(false); // Ensure the test is not running initially
        setHasStartedTyping(false); // Reset typing state
        setTotalWordsTyped(0); // Reset total words typed
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
        setTotalWordsTyped(wordsTyped.length); // Update total words typed

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

    const calculateResults = () => {
        const accuracy = (wordsCorrect / totalWordsTyped) * 100 || 0; // Calculate accuracy
        const wpm = (totalWordsTyped / (testDuration / 60)).toFixed(2); // Calculate WPM
        return { accuracy, wpm };
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
        }),

        createElement(
            'div',
            { className: 'duration-buttons' },
            createElement(
                'button',
                { onClick: () => { setTestDuration(30); displayTest(difficulty); } },
                '30 Sec'
            ),
            createElement(
                'button',
                { onClick: () => { setTestDuration(60); displayTest(difficulty); } },
                '60 Sec'
            )
        ),

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
            createElement('span', null, ` | Total Words Typed: ${totalWordsTyped}`),
            createElement('span', null, ` | Time Remaining: ${timer} seconds`)
        ),
        
        // Display accuracy and WPM when the test is completed
        !isTestRunning && totalWordsTyped > 0 && createElement(
            'div',
            { className: 'results' },
            (() => {
                const { accuracy, wpm } = calculateResults();
                return createElement(
                    'span',
                    null,
                    `Accuracy: ${accuracy.toFixed(2)}% | WPM: ${wpm}`
                );
            })()
        )
    );
}

export default App;
