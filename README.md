# NebulaOCR WebApp

NebulaOCR is a web interface for running Optical Character Recognition on PDF files.

What make NebulaOCR unique is its focus on allowing users to select specific regions of a PDF page for text extraction, rather than processing the entire document. 
This is particularly useful for extracting text from documents with columns of text, tables, or other structured data where only a portion of the page is relevant.

## Features

- Upload PDF documents via file picker or drag and drop.
- Browse pages, zoom and pan to inspect the content.
- Select a region with a crop tool to extract text from that area.
- Optional pre‑processing: grayscale, noise reduction, thresholding, deskewing and contrast enhancement.
- View the OCR result and copy the text to your clipboard.

## Getting started

1. Install dependencies:
   ```bash
   yarn install # or npm install
   ```
2. Create a `.env` file to point the app at your NebulaOCR API:
   ```bash
   REACT_APP_API_URL=http://localhost:8089
   ```
3. Run the development server:
   ```bash
   yarn dev
   ```

Open `http://localhost:5173` in your browser to use the app.

## Useful scripts

- `yarn dev` – start the app with hot reload.
- `yarn build` – build the production bundle in `dist/`.
- `yarn preview` – serve the built bundle locally.
- `yarn lint` – run ESLint checks.

## Project structure

- `src/` – React components and application code.
- `public/` – static assets like the favicon.
- `vite.config.ts` – Vite configuration and environment variable setup.

---
This project is provided as an example interface for the Nebula OCR service.
