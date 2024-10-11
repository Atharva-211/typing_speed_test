import React, { createElement, useState, useEffect, Children} from "react";

function App(){
    const [difficulty, setDifficulty] = useState(1);
    const [testWords, setTestWords] = useState([]);

    useEffect(() => {
        displayTest(difficulty);
    }, [difficulty]);

    const displayTest = (diff) => {
        const newTest = randomWords(diff);
        setTestWords(newTest);
    };

    const randomWords = (diff) => {
        const topWords = ['hello', 'atharva'];
        const basicWords = ['a','bbb'];

        const worldArray = diff === 1 ? basicWords : topWords;
        const selectedWords = [];
        for (let i = 0; i < 40 ; i++) {
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
            // value: isValidInputTimeValue,
            // onchange: HandleInputChange,
            id: 'textInput',
            // disabled: timer <= 0,
        }),

        // createElement(
        //     'button' ,
        //     { onclick: () => setTimer(60) },
        //     '60 seconds'
        // ),
    );
}
export default App;