import React, { useState, useEffect, useRef } from "react";
import { FileImage, X } from "lucide-react";
import "./FileUpload.css";

// Message component to display each status as a block
const StatusMessage = ({ message, type }) => {
    let messageStyle = '';
    switch (type) {
        case 'info':
            messageStyle = 'info-block';
            break;
        case 'success':
            messageStyle = 'success-block';
            break;
        case 'error':
            messageStyle = 'error-block';
            break;
        default:
            messageStyle = 'info-block';
            break;
    }

    return (
        <div className={`status-message ${messageStyle}`}>
            <p>{message}</p>
        </div>
    );
};

const FileUpload = ({ onFileSelect, setResult}) => {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessages, setStatusMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {

    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatusMessages([]);
        setIsProcessing(true);

        const ws = new WebSocket('ws://localhost:8000/ws');

        ws.onopen = () => {
            ws.send(file.name);
            ws.send(file);
        };
        ws.onmessage = (event) => {
            let parsed = null;
            let finished = null
            try {
                parsed = JSON.parse(event.data);
            } catch {
                parsed = null;
            }

            if (parsed) {
                let result = null;
                
                // If it's valid JSON, parse and display
                const messageData = parsed
                try{
                    result = messageData.result;
                }
                catch{
                    result = null;
                }
                if(result){
                    console.log("result",result.text);
                    setResult(result.text);
                }
                else if (messageData.message && messageData.type) {
                    console.log(messageData)
                    const { message, type } = messageData;
                    setStatusMessages((prevMessages) => [
                        ...prevMessages,
                        { message, type },
                    ]);
                }
                try {
                    finished = messageData.finished;
                }
                catch {
                    finished = null;
                }
                if (finished) {
                    setIsProcessing(false);
                }
            } else {
                // If it's not valid JSON, treat it as plain text (info type by default)
                setStatusMessages((prevMessages) => [
                    ...prevMessages,
                    { message: event.data, type: 'info' },
                ]);
            }
        };
        // Handle WebSocket closure
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(ws);

        // Cleanup WebSocket when component unmounts
        return () => {
            if (ws) ws.close();
        };


        // You can listen to further updates from the backend in real-time
    };
    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            onFileSelect(file); // Pass the selected file to the parent component

            // If it's an image, generate a preview
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result); // Set the image preview
                };
                reader.readAsDataURL(file);
            } else {
                setImagePreview(null); // Clear image preview if not an image
            }
        }


    };

    const handleRemoveFile = () => {
        setFile(null);  // Clear the uploaded file
        setImagePreview(null);   // Clear the image preview
        onFileSelect(null);
        setStatusMessages([]);    // Pass null to parent component to reset state
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    // Handle file remove


    //  Send the file to the backend
    // const handleProcessInvoice = async () => {
    //     if (!uploadedFile) {
    //         alert("Please upload a file first.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("file", uploadedFile);

    //     try {
    //         const response = await fetch("http://localhost:8000/upload-invoice", {
    //             method: "POST",
    //             body: formData,
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to upload the file");
    //         }

    //         const data = await response.json();
    //         alert(`File uploaded successfully: ${data.message}`);
    //     } catch (error) {
    //         console.error("Error:", error);
    //         alert("Error uploading the file");
    //     }
    // };

    return (
        <>
            <div className="upload-box">
                <div className="upload-content">
                    <div className="upload-text">
                        <FileImage className="icon-small" />
                        <span>Drag and drop file here</span>
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="file-input"
                        accept=".png,.jpg,.jpeg,.tiff,.tif,.pdf"
                        onChange={handleFileUpload}
                        id="file-input"
                        style={{ display: 'none' }} // Hide the default file input
                    />

                    {/* Custom button to trigger file input */}
                    <button
                        className="browse-btn"
                        onClick={() => document.getElementById("file-input").click()} // Trigger file input click
                    >
                        Choose File
                    </button>
                </div>
                <p className="file-info">
                    Limit 200MB per file • PNG, JPG, JPEG, TIFF, TIF, PDF
                </p>

                {file && (
                    <div className="uploaded-file">
                        <p className="file-name">
                            <span>{file.name}</span>
                            <button className="close-btn" onClick={handleRemoveFile}>
                                <X className="close-icon" />
                            </button>
                        </p>

                        {/* Image preview */}
                        {!file.name.toLowerCase().endsWith(".pdf") ? (
                            <div className="image-preview">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="preview-img"
                                />
                            </div>
                        ) : (
                            <div className="pdf-message">📄 <strong>PDF file detected</strong></div>
                        )}

                        {/* Process Invoice Button */}
                        <div className="process-btn-wrapper">
                            <button className="process-btn" onClick={handleUpload} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Upload and Process'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Render status messages */}

            </div>
            <div className="status-messages">
                {statusMessages.map((msg, index) => (
                    <StatusMessage key={index} message={msg.message} type={msg.type} />
                ))}
            </div>
        </>
    );
};

export default FileUpload;
