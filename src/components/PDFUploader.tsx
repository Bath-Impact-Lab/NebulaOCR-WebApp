// src/components/PDFUploader.tsx

import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface PDFUploadResponse {
    pdf_id: string;
    pages: number;
}

interface PDFUploaderProps {
    setPdfId: (id: string) => void;
    setPages: (count: number) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ setPdfId, setPages }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const apiURL = 'https://nebulaocr-api.onrender.com';
            const response = await axios.post<PDFUploadResponse>(apiURL+'/upload_pdf', formData);
            setPdfId(response.data.pdf_id);
            setPages(response.data.pages);
            alert("PDF uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload PDF.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload PDF"}
            </button>
        </div>
    );
};

export default PDFUploader;
