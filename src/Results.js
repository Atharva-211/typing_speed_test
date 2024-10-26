import React from 'react';

const Results = ({ accuracy, wpm, netWPM, mistakes, highestWPM }) => {
    return (
        <div className="results">
            <h3>Test Complete!</h3>
            <div className="results-grid">
                <div className="result-item">
                    <span className="label">WPM:</span>
                    <span className="value">{wpm}</span>
                </div>
                <div className="result-item">
                    <span className="label">Net WPM:</span>
                    <span className="value">{netWPM}</span>
                </div>
                <div className="result-item">
                    <span className="label">Accuracy:</span>
                    <span className="value">{accuracy.toFixed(2)}%</span>
                </div>
                <div className="result-item">
                    <span className="label">Mistakes:</span>
                    <span className="value">{mistakes}</span>
                </div>
                <div className="result-item">
                    <span className="label">Personal Best:</span>
                    <span className="value">{highestWPM} WPM</span>
                </div>
            </div>
        </div>
    );
};

export default Results;