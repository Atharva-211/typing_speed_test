import React, { createElement, useState, useEffect, Children} from "react";

function App(){
    const [difficulty, setDifficulty] = useState(1);
    const [testWords, setTestWords] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [flag, setFlag] = useState(0);
    const [wordNo,setWordNo] = useState(1);
    const [wordsSubmitted, setWordsSubmitted] = useState(0);
    const [wordsCorrect, setWordsCorrect] = useState(0);

    useEffect(() => {
        displayTest(difficulty);
    }, [difficulty]);

    const displayTest = (diff) => {
        const newTest = randomWords(diff);
        setTestWords(newTest);
    };

    const handleInputChange = (event) => {
        const charEntered = event.target.value;
        setInputValue(charEntered);

        if (flag === 0){
            setFlag(1);
            // timeStart();
        }

        if (/\s/g.test(event.nativeEvent.data)) {
            checkWord();
        } else {
            currentWord();
        }
    };

    const currentWord = () => {
        const currentSpan = document.getElementById(`word-${wordNo}`);
        if (!currentSpan) {
            return; // If currentSpan is null, exit the function
        }
        const curSpanWord = currentSpan.innerText.trim();
    
        if (inputValue === curSpanWord.substring(0, inputValue.length)) {
            currentSpan.classList.add('current');
        } else {
            currentSpan.classList.add('wrong');
        }
    };
    


    const checkWord = () => {
        const currentSpan = document.getElementById(`word-${wordNo}`);
        
        // Check if the element exists before trying to access its innerText
        if (!currentSpan) {
            return; // Exit the function if currentSpan is null
        }
        
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
    
        // Ensure wordNo doesn't exceed the number of words
        if (wordNo >= 40) {
            resetWordStyle();
            displayTest(difficulty);
            setWordNo(1); // Reset the word number after the test is displayed
        }
    };
    
    const resetWordStyle = () => {
        const wordSpans = document.querySelectorAll(`[id^=word-]`);
        wordSpans.forEach((span) => {
            span.classList.remove('correct', 'wrong');
        });
    }

    const randomWords = (diff) => {
        const topWords = ['ability', 'able', 'about', 'your', 'yourself'];
        const basicWords = ['a', 'about', 'above', 'across'];
        const quotes = ['The word paragraph comes from the Latin word paragraphos, which is roughly translated to mean a short stroke marking a break in sense. '];

        const worldArray = diff === 1 ? basicWords : (diff === 2 ? topWords : quotes);
        const selectedWords = [];
        const numberOfWords = worldArray === quotes ? 2 : 40;

        for (let i = 0; i < numberOfWords; i++) {
            const randomNumber = Math.floor(Math.random() * worldArray.length);
            selectedWords.push(worldArray[randomNumber]);
        }
        return selectedWords;
    };

    const createElement = (type, props = {}, ...Children) => {
        return React.createElement(type, props, ...Children);
    };

    return createElement(
        'div',
        { className: 'App'},
        createElement('h1', null , 'typing Test'),
        createElement(
            'div',
            { id: 'textDisplay'},
            testWords.map((word, index) =>
                createElement('span', {key: index, id: `word-${index + 1}`}, `${word} `)
            )
        ),

        createElement('input', {
            type: 'text',
            value: inputValue,
            onChange: handleInputChange,
            id: 'textInput',
            // disabled: timer <= 0,
        }),

        // createElement(
        //     'button' ,
        //     { onclick: () => setTimer(60) },
        //     '60 seconds'
        // ),

        createElement(
            'button',
            { onClick: () => setDifficulty(1)},
            'big'
        ),

        createElement(
            'button',
            { onClick: () => setDifficulty(2)},
            'pro'
        ),

        createElement(
            'button',
            { onClick: () => setDifficulty(3)},
            'try'
        ),

        createElement(
            'div',
            { className: 'status'},
            // createElement('span', null, `Time: ${timer}`),
            createElement('span', null, `words correct : ${wordsCorrect}`)
        )
    );
}
export default App;