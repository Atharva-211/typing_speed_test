// DurationButtons.js
import React from 'react';

const DurationButtons = ({ setTestDuration, displayTest, difficulty }) => {
    return (
        <div className="duration-buttons controls">
            <button onClick={() => { setTestDuration(30); displayTest(difficulty); }}>30 Sec</button>
            <button onClick={() => { setTestDuration(60); displayTest(difficulty); }}>60 Sec</button>
        </div>
    );
};

export default DurationButtons;
