// DifficultyButtons.js
import React from 'react';

const DifficultyButtons = ({ setDifficulty, displayTest }) => {
    return (
        <div className="difficulty-buttons controls">
            <button onClick={() => setDifficulty(1)}>Basic</button>
            <button onClick={() => setDifficulty(2)}>Advanced</button>
            <button onClick={() => setDifficulty(3)}>Quotes</button>
        </div>
    );
};

export default DifficultyButtons;
