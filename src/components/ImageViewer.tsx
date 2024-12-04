// src/components/ImageViewer.tsx

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactCrop, {Crop, PercentCrop, PixelCrop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Box } from '@mui/material';

interface PreprocessOptions {
    grayscale: boolean;
    denoise: boolean;
    threshold: boolean;
    deskew: boolean;
    contrast: boolean;
}

interface ImageViewerProps {
    pdfId: string;
    pages: number;
    selectedPage: number;
    setSelectedPage: React.Dispatch<React.SetStateAction<number>>;
    onSelectRegion: (text: string) => void;
    preprocessOptions: PreprocessOptions;
    setPreprocessOptions: React.Dispatch<React.SetStateAction<PreprocessOptions>>;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
                                                     pdfId,
                                                     pages,
                                                     selectedPage,
                                                     setSelectedPage,
                                                     onSelectRegion,
                                                     preprocessOptions,
                                                     setPreprocessOptions
                                                 }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [zoom, setZoom] = useState(1);
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 10,
        height: 10,
        x: 45,
        y: 45,
    });
    const [completedCrop, setCompletedCrop] = useState<PercentCrop | null>(null);
    const [offset, setOffset] = useState<{ x: number; y: number }>({x: 0, y: 0});


    useEffect(() => {
        if (pdfId && selectedPage) {
            fetchPageImage();
        }
        // Cleanup the URL object when component unmounts or imageUrl changes
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdfId, selectedPage]);

    const fetchPageImage = async () => {
        setLoading(true);
        try {
            const apiURL = process.env.REACT_APP_API_URL;
            const response = await axios.get(apiURL+`/get_page/${pdfId}/${selectedPage}`, {
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            setImageUrl(url);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch page image.");
        } finally {
            setLoading(false);
        }
    };

    const handleCropComplete = (_crop: PixelCrop, percentCrop: PercentCrop) => {
        setCompletedCrop(percentCrop);
    };

    const handlePerformOCR = async () => {
        if (!completedCrop) {
            alert("Please select a region for OCR.");
            return;
        }

        const {x, y, width, height} = completedCrop;

        console.log(x, y, width, height, zoom, offset);
        const bbox = [
            (x) * (1 / zoom),
            (y) * (1 / zoom),
            (x + width) * (1 / zoom),
            (y + height) * (1 / zoom),
        ];

        const ocrRequest = {
            pdf_id: pdfId,
            page_number: selectedPage,
            bbox: bbox,
            preprocess: preprocessOptions
        };

        try {
            const apiURL = process.env.REACT_APP_API_URL;
            const response = await axios.post<{ text: string }>(apiURL + '/perform_ocr', ocrRequest);
            console.log(response.data);
            onSelectRegion(response.data.text);
        } catch (error) {
            console.error(error);
            alert("OCR failed.");
        }
    };

    const handlePreprocessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setPreprocessOptions(prev => ({...prev, [name]: checked}));
    };

    const handleZoom = (delta: number) => {
        setZoom(prevState => prevState + delta);
    }

    const handlePan = (deltaX: number, deltaY: number) => {
        setOffset(prevState => ({x: prevState.x + deltaX, y: prevState.y + deltaY}));
    }


    const getImageStyle = () => ({
        transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
        transformOrigin: 'top left',
        transition: 'transform 0.1s ease-out',
        cursor: 'grab',
    });

    return (
        <div>
            {pages > 1 && (
                <div id="page_count" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => setSelectedPage(prev => Math.max(prev - 1, 1))} disabled={selectedPage <= 1}>
                        Previous
                    </button>
                    <span>&nbsp;Page {selectedPage} of {pages}&nbsp;</span>
                    <button onClick={() => setSelectedPage(prev => Math.min(prev + 1, pages))}
                            disabled={selectedPage >= pages}>
                        Next
                    </button>
                </div>
            )}

            {/* Zoom and Pan Controls */}
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => handleZoom(0.1)}>Zoom In</button>
                <button onClick={() => handleZoom(-0.1)} disabled={zoom <= 0.5}>Zoom Out</button>

                <button onClick={() => handlePan(0, -50)}>Pan Up</button>
                <button onClick={() => handlePan(0, 50)}>Pan Down</button>
                <button onClick={() => handlePan(-50, 0)}>Pan Left</button>
                <button onClick={() => handlePan(50, 0)}>Pan Right</button>

                <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
            </div>

            {loading ? <p>Loading...</p> : imageUrl && (
                    <ReactCrop
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={handleCropComplete}

                    >
                        <img src={imageUrl} style={getImageStyle()}/>
                    </ReactCrop>
            )}

            <div>
                <Box display="flex" justifyContent="center" marginTop="20px">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePerformOCR}
                        disabled={!completedCrop}
                    >
                        Perform OCR on Selected Region
                    </Button>
                </Box>
                <h3>Preprocessing Options</h3>
                <label>
                    <input
                        type="checkbox"
                        name="grayscale"
                        checked={preprocessOptions.grayscale}
                        onChange={handlePreprocessChange}
                    />
                    Grayscale
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="denoise"
                        checked={preprocessOptions.denoise}
                        onChange={handlePreprocessChange}
                    />
                    Noise Reduction
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="threshold"
                        checked={preprocessOptions.threshold}
                        onChange={handlePreprocessChange}
                    />
                    Thresholding
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="deskew"
                        checked={preprocessOptions.deskew}
                        onChange={handlePreprocessChange}
                    />
                    Deskewing
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="contrast"
                        checked={preprocessOptions.contrast}
                        onChange={handlePreprocessChange}
                    />
                    Contrast Enhancement
                </label>
            </div>

        </div>
    );
};

export default ImageViewer;
