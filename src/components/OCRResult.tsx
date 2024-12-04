// src/components/OCRResult.tsx

import React from 'react';

interface OCRResultProps {
    text: string;
}

const OCRResult: React.FC<OCRResultProps> = ({ text }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
            .then(() => alert("Text copied to clipboard!"))
            .catch(err => {
                console.error(err);
                alert("Failed to copy text.");
            });
    };

    return (
        <div>
            <h3>OCR Result</h3>
            <textarea value={text} readOnly rows={10} style={{ width: '450px' }} />
            <button onClick={handleCopy} disabled={!text}>
                Copy Text
            </button>
        </div>
    );
};

export default OCRResult;
