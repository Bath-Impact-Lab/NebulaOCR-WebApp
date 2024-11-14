import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Input, Container, Box, Typography } from '@mui/material';

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
            const apiURL = 'https://nebula-api.hivebrain.ai';
            const response = await axios.post<PDFUploadResponse>(`${apiURL}/upload_pdf`, formData);
            setPdfId(response.data.pdf_id);
            setPages(response.data.pages);
        } catch (error) {
            console.error(error);
            alert("Failed to upload PDF.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container>
            <Box my={4} textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Upload PDF
                </Typography>
                <Input
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{ accept: 'application/pdf' }}
                />
                <Box my={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={uploading}
                        startIcon={uploading && <CircularProgress size={20} />}
                    >
                        {uploading ? "Uploading..." : "Proces"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PDFUploader;