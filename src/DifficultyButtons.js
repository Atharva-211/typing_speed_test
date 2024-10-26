// DifficultyButtons.js
import React from 'react';

const DifficultyButtons = ({ setDifficulty, displayTest }) => {
    return (
        <div className="difficulty-buttons controls">
            <button onClick={() => setDifficulty(1)}>Easy</button>
            <button onClick={() => setDifficulty(2)}>Medium</button>
            <button onClick={() => setDifficulty(3)}>Hard</button>
        </div>
    );
};

export default DifficultyButtons;
