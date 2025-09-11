export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}


export async function convertPdfToImage( file: File ): Promise<PdfConversionResult> {

    if (typeof window === 'undefined') {
        throw new Error('convertPdfToImage can only run in the browser');
    }

    const pdfjsLib = await import('pdfjs-dist');

    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';


    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");

        if (!context) throw new Error('Could not get 2D context');



        await page.render({ canvasContext: context, canvas, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve({imageUrl: "", file: null, error: "Failed to create image blob",});
                    return;
                }
                // Create a File from the blob with the same name as the pdf
                const originalName = file.name.replace(/\.pdf$/i, "") + ".png";
                const imageFile = new File([blob], originalName, {type: "image/png"});
                resolve({imageUrl: URL.createObjectURL(blob), file: imageFile,});
            }, "image/png", 1.0)
                    });

    } catch (error) {
        return {imageUrl: "", file: null, error: `Failed to convert PDF: ${error}`,};
    }
}