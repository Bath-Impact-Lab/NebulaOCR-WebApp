// src/App.tsx

import React, { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import ImageViewer from './components/ImageViewer';
import OCRResult from './components/OCRResult';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Container from '@mui/material/Container';


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
        <Container className="App" maxWidth="sm">
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
        </Container>
    );
};

export default App;
