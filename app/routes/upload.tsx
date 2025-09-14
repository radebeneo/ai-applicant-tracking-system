import React, {useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/format";
import {prepareInstructions} from "../../constants";

const Upload = () => {

    const {isLoading, auth, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalysis = async ({ companyName, jobTitle, jobDescription, file} : { companyName: string, jobTitle: string, jobDescription: string, file: File} ) =>{
        try {
            setIsProcessing(true);
            setStatusText('Analyzing your resume...');

            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) return setStatusText('Error: Failed to upload file.');

            setStatusText('Converting to image...');
            console.log('Starting PDF conversion');
            const imageFile = await convertPdfToImage(file);
            console.log('PDF conversion result', imageFile);
            if (!imageFile.file) {
                console.error(imageFile.error);
                return setStatusText('Error: Failed to convert PDF to image.');
            }

            setStatusText('Uploading image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) return setStatusText('Error: Failed to upload image.');

            setStatusText('Preparing analysis...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: '',
            }

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing resume...');
            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({jobTitle, jobDescription})
            )

            if (!feedback) return setStatusText('Error: Failed to analyze resume.');

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            try{
                data.feedback = JSON.parse(feedbackText);
            } catch {
                data.feedback = feedbackText;
            }

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            navigate(`/resume/${uuid}`)

        } catch (error) {
            console.error('Error during analysis:', error);
            setStatusText(`Unexpected error: ${error}`);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget.closest('form');

        if (!form) return;

        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalysis({companyName, jobTitle, jobDescription, file});
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-12">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ): (
                        <h2>Drop Your Resume for an ATS Score and Improvement Tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name" >Company Name</label>
                                <input type="text" id="company-name" name="company-name" placeholder="Company Name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title" >Job Title</label>
                                <input type="text" id="job-title" name="job-title" placeholder="Job Title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description" >Job Description</label>
                                <textarea rows={5} id="job-description" name="job-description" placeholder="Job Description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader" >Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>
                            <button className="primary-button" type="submit">
                                Analyse Resume
                            </button>

                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;