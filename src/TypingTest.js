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
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [highestWPM, setHighestWPM] = useState(
        localStorage.getItem('highestWPM') ? parseFloat(localStorage.getItem('highestWPM')) : 0
    );
    
    const textDisplayRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        displayTest(difficulty);
        // Focus input when component mounts
        inputRef.current?.focus();
    }, [difficulty]);

    useEffect(() => {
        let interval = null;
        if (isTestRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            endTest();
        }
        return () => clearInterval(interval);
    }, [isTestRunning, timer]);

    const endTest = () => {
        setIsTestRunning(false);
        setIsInputDisabled(true);
        setShowResults(true);
        
        // Update highest WPM if current WPM is higher
        const currentWPM = parseFloat((wordsCorrect / (testDuration / 60)).toFixed(2));
        if (currentWPM > highestWPM) {
            setHighestWPM(currentWPM);
            localStorage.setItem('highestWPM', currentWPM.toString());
        }
    };

    const displayTest = (diff) => {
        const newTest = randomWords(diff);
        setTestWords(newTest.slice(0, 40));
        resetTestState();
        inputRef.current?.focus();
    };

    const resetTestState = () => {
        setWordsCorrect(0);
        setInputValue('');
        setCurrentTypedWords([]);
        setCurrentWordIndex(0);
        setMistakes(0);
        resetWordStyle();
        setTimer(testDuration);
        setIsTestRunning(false);
        setHasStartedTyping(false);
        setTotalWordsTyped(0);
        setIsInputDisabled(false);
        setShowResults(false);
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
    
        if (!hasStartedTyping) {
            setIsTestRunning(true);
            setHasStartedTyping(true);
        }
    
        // Handle space key for word completion
        if (value.endsWith(' ')) {
            const typedWord = value.trim();
            const currentWord = testWords[currentWordIndex];
            
            // Check if word is correct
            if (typedWord === currentWord) {
                setWordsCorrect(prev => prev + 1);
            } else {
                setMistakes(prev => prev + 1);
            }
            
            // Move to next word
            setCurrentWordIndex(prev => prev + 1);
            setInputValue('');
            setTotalWordsTyped(prev => prev + 1);
            
            // Load more words if needed
            if (currentWordIndex >= testWords.length - 10) {
                loadNewWords();
            }
        }
        
        updateWordStyles(value);
    };

    const updateWordStyles = (currentInput) => {
        // Clear previous styles
        resetWordStyle();
        
        const currentWord = testWords[currentWordIndex];
        const currentSpan = document.getElementById(`word-${currentWordIndex}`);
        
        if (currentSpan) {
            if (currentInput === currentWord) {
                currentSpan.classList.add('correct');
            } else if (currentWord.startsWith(currentInput)) {
                currentSpan.classList.add('current');
            } else {
                currentSpan.classList.add('wrong');
            }
            
            // Scroll to keep current word visible
            ensureWordVisible(currentSpan);
        }
    };

    const ensureWordVisible = (wordElement) => {
        if (textDisplayRef.current && wordElement) {
            const container = textDisplayRef.current;
            const containerRect = container.getBoundingClientRect();
            const wordRect = wordElement.getBoundingClientRect();
            
            if (wordRect.bottom > containerRect.bottom) {
                container.scrollTop += wordRect.height * 2;
            }
        }
    };

    const loadNewWords = () => {
        const newWords = randomWords(difficulty);
        setTestWords(prev => [...prev, ...newWords.slice(0, 20)]);
    };

    const resetWordStyle = () => {
        const wordSpans = document.querySelectorAll('[id^=word-]');
        wordSpans.forEach(span => {
            span.classList.remove('correct', 'wrong', 'current');
        });
    };

    const randomWords = (diff) => {
        // Extended word lists for more variety
        const basicWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'];
        const advancedWords = ['algorithm', 'development', 'experience', 'technology', 'professional', 'implementation', 'architecture', 'sophisticated', 'development', 'performance'];
        const quotes = [
            'Success is not final, failure is not fatal: it is the courage to continue that counts.',
            'The only way to do great work is to love what you do.',
            'Innovation distinguishes between a leader and a follower.',
            'The future belongs to those who believe in the beauty of their dreams.',
            'Life is what happens when youre busy making other plans.'
        ];

        switch (diff) {
            case 1:
                return Array.from({ length: 80 }, () => basicWords[Math.floor(Math.random() * basicWords.length)]);
            case 2:
                return Array.from({ length: 80 }, () => advancedWords[Math.floor(Math.random() * advancedWords.length)]);
            case 3:
                return quotes[Math.floor(Math.random() * quotes.length)].split(' ');
            default:
                return basicWords;
        }
    };

    const calculateResults = () => {
        const accuracy = (wordsCorrect / totalWordsTyped) * 100 || 0;
        const wpm = (wordsCorrect / (testDuration / 60)).toFixed(2);
        const netWPM = (((wordsCorrect / (testDuration / 60)) - (mistakes / (testDuration / 60)))).toFixed(2);
        return { accuracy, wpm, netWPM };
    };

    return (
        
        <div className="typing-test-container">
            <div className="stats-bar">
                <span>Highest WPM: {highestWPM}</span>
                <span>Timer: {timer}s</span>
            </div>

            <div id="textDisplay" ref={textDisplayRef} className="text-display">
                {testWords.map((word, index) => (
                    <span 
                        key={index} 
                        id={`word-${index}`}
                        className={index === currentWordIndex ? 'current' : ''}
                    >
                        {word}{' '}
                    </span>
                ))}
            </div>

            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="input-box"
                disabled={isInputDisabled}
                placeholder={isTestRunning ? 'Keep typing...' : 'Type here to start...'}
            />

            <div className="controls-container">
                <DurationButtons 
                    setTestDuration={setTestDuration} 
                    displayTest={displayTest} 
                    difficulty={difficulty} 
                    disabled={isTestRunning}
                />
                <DifficultyButtons 
                    setDifficulty={setDifficulty} 
                    displayTest={displayTest}
                    disabled={isTestRunning}
                />
            </div>

            <div className="status">
                <span>Words Correct: {wordsCorrect}</span>
                <span>Mistakes: {mistakes}</span>
                <span>Accuracy: {((wordsCorrect / (wordsCorrect + mistakes)) * 100 || 0).toFixed(2)}%</span>
            </div>

            {showResults && (
                <div className="results-container">
                    <Results 
                        accuracy={calculateResults().accuracy}
                        wpm={calculateResults().wpm}
                        netWPM={calculateResults().netWPM}
                        mistakes={mistakes}
                        highestWPM={highestWPM}
                    />
                    <button 
                        onClick={() => displayTest(difficulty)} 
                        className="restart-button"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default TypingTest;