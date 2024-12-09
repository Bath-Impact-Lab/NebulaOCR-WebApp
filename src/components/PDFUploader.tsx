import React, { useState, ChangeEvent, DragEvent } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Input, Container, Box, Typography } from '@mui/material';
import { Paper } from '@mui/material';

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

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            await uploadFile(selectedFile); // Directly call the upload function
        }
    };

    const handleDragOver = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            await uploadFile(droppedFile);  // Directly call the upload function
            e.dataTransfer.clearData();
        }
    };

    const handleUpload = async () => {
        if (file) {
            await uploadFile(file);
        } else {
            alert("Please select a PDF file.");
        }
    };

    const uploadFile = async (fileToUpload: File) => {
        const formData = new FormData();
        formData.append('file', fileToUpload);

        setUploading(true);
        try {
            const apiURL = process.env.REACT_APP_API_URL;
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
                <Input
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{ accept: 'application/pdf' }}
                />
                <Typography variant="h5" sx={{ p: 3, margin: '10px', marginBottom: '10px' }}>
                    - or -
                </Typography>
                <Paper
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    sx={{
                        p: 3,
                        border: '1px dashed grey',
                        margin: '10px',
                        minHeight: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >

                    Drag & drop here!
                </Paper>
                <Box my={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={uploading}
                        startIcon={uploading && <CircularProgress size={20} />}
                    >
                        {uploading ? "Processing..." : "Start"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PDFUploader;