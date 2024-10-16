// src/App.tsx

import React, { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import ImageViewer from './components/ImageViewer';
import OCRResult from './components/OCRResult';
import './App.css';

interface PreprocessOptions {
    grayscale: boolean;
    denoise: boolean;
    threshold: boolean;
    deskew: boolean;
    contrast: boolean;
}

const App: React.FC = () => {
    const [pdfId, setPdfId] = useState<string | null>(null);
    const [pages, setPages] = useState<number>(0);
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [ocrText, setOcrText] = useState<string>("");
    const [preprocessOptions, setPreprocessOptions] = useState<PreprocessOptions>({
        grayscale: true,
        denoise: true,
        threshold: false,
        deskew: false,
        contrast: true
    });

    return (
        <div className="App">
            <h1>NebulaOCR</h1>
            {!pdfId ? (
                <PDFUploader setPdfId={setPdfId} setPages={setPages} />
            ) : (
                <>
                    <ImageViewer
                        pdfId={pdfId}
                        pages={pages}
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onSelectRegion={setOcrText}
                        preprocessOptions={preprocessOptions}
                        setPreprocessOptions={setPreprocessOptions}
                    />
                    <OCRResult text={ocrText} />
                </>
            )}
        </div>
    );
};

export default App;
