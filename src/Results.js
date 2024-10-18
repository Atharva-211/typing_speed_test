// Results.js
import React from 'react';

const Results = ({ accuracy, wpm }) => {
    return (
        <div className="results">
            <span>Accuracy: {accuracy.toFixed(2)}%</span>
            <span> | WPM: {wpm}</span>
        </div>
    );
};

export default Results;
