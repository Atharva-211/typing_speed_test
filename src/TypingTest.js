import React, { useState, useEffect, useRef } from 'react';
import DurationButtons from './DurationButtons';
import DifficultyButtons from './DifficultyButtons';
import Results from './Results';

const TypingTest = () => {
    const [difficulty, setDifficulty] = useState(1);
    const [testWords, setTestWords] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [wordsCorrect, setWordsCorrect] = useState(0);
    const [totalWordsTyped, setTotalWordsTyped] = useState(0);
    const [currentTypedWords, setCurrentTypedWords] = useState([]);
    const [timer, setTimer] = useState(60);
    const [isTestRunning, setIsTestRunning] = useState(false);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [testDuration, setTestDuration] = useState(60);
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [showResults, setShowResults] = useState(false);
    
    const textDisplayRef = useRef(null); // Ref for the text display container

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
            setIsTestRunning(false);
            setIsInputDisabled(true);
            setShowResults(true);
        }
        return () => clearInterval(interval);
    }, [isTestRunning, timer]);

    const displayTest = (diff) => {
        const newTest = randomWords(diff);
        setTestWords(newTest.slice(0, 40)); // Show only first 40 words initially
        setWordsCorrect(0);
        setInputValue('');
        setCurrentTypedWords([]);
        resetWordStyle();
        setTimer(testDuration);
        setIsTestRunning(false);
        setHasStartedTyping(false);
        setTotalWordsTyped(0);
        setIsInputDisabled(false);
        setShowResults(false);
    };

    const handleInputChange = (event) => {
        const charEntered = event.target.value;
        setInputValue(charEntered);
    
        if (!hasStartedTyping) {
            setIsTestRunning(true);
            setHasStartedTyping(true);
        }
    
        const wordsTyped = charEntered.trim().split(' ');
        setCurrentTypedWords(wordsTyped);
        checkWords(wordsTyped);
        
        // Scroll to the current word with an offset for the next line
        const currentWordIndex = wordsTyped.length - 1; // The last typed word's index
        const currentWordElement = document.getElementById(`word-${currentWordIndex + 1}`);
        
        if (currentWordElement) {
            const textDisplay = textDisplayRef.current;
            const wordElementOffsetTop = currentWordElement.offsetTop; // Current word's position
            const wordElementHeight = currentWordElement.offsetHeight; // Height of the current word
            const scrollOffset = wordElementHeight * 2; // Adjust this to scroll two lines down
    
            // Scroll to the position with an offset
            textDisplay.scrollTop = wordElementOffsetTop - scrollOffset;
        }
    };
    

    const checkWords = (wordsTyped) => {
        let correctCount = 0;
        wordsTyped.forEach((typedWord, index) => {
            const currentSpan = document.getElementById(`word-${index + 1}`);
            if (!currentSpan) return;
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
        setTotalWordsTyped(wordsTyped.length);

        // Load more words dynamically when user has typed more than 30 words
        if (wordsTyped.length >= testWords.length - 10) {
            loadNewWords();
        }
    };

    const loadNewWords = () => {
        const newTest = randomWords(difficulty);
        setTestWords((prevWords) => [...prevWords, ...newTest.slice(0, 40)]); // Load next 40 words gradually
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
            return Array.from({ length: 80 }, () => basicWords[Math.floor(Math.random() * basicWords.length)]);
        } else if (diff === 2) {
            return Array.from({ length: 80 }, () => topWords[Math.floor(Math.random() * topWords.length)]);
        } else if (diff === 3) {
            const selectedQuotes = Array.from({ length: 40 }, () => {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                return randomQuote.split(' ');
            });
            return selectedQuotes.flat();
        }
    };

    const calculateResults = () => {
        const accuracy = (wordsCorrect / totalWordsTyped) * 100 || 0;
        const wpm = (wordsCorrect / (testDuration / 60)).toFixed(2);
        return { accuracy, wpm };
    };

    const restartTest = () => {
        displayTest(difficulty);
    };

    return (
        <div className="typing-test-container">
            {/* Display words */}
            <div id="textDisplay" ref={textDisplayRef}>
                {testWords.map((word, index) => (
                    <span key={index} id={`word-${index + 1}`}>{word} </span>
                ))}
            </div>

            {/* Input field for typing */}
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                id="textInput"
                className="input-box"
                disabled={isInputDisabled}
            />

            {/* Buttons for duration and difficulty */}
            <div className="buttons-container">
                <DurationButtons setTestDuration={setTestDuration} displayTest={displayTest} difficulty={difficulty} />
                <DifficultyButtons setDifficulty={setDifficulty} displayTest={displayTest} />
            </div>

            {/* Status info */}
            <div className="status">
                <span>Words Correct: {wordsCorrect}</span>
                <span> | Total Words Typed: {totalWordsTyped}</span>
                <span> | Time Remaining: {timer} seconds</span>
            </div>

            {/* Results Display */}
            {showResults && (
                <div className="results-container">
                    <Results accuracy={calculateResults().accuracy} wpm={calculateResults().wpm} />
                    <button onClick={restartTest} className="restart-button">Restart Test</button>
                </div>
            )}
        </div>
    );
};

export default TypingTest;
