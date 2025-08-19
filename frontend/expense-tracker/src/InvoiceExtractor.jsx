import React, { useState } from "react";
import {
    Upload,
    FolderOpen,
    BarChart3
} from "lucide-react";
import StatusCard from "./StatusCard";
import FileUpload from "./components/FileUpload";
import "./styles/InvoiceExtractor.css";  // Importing the external CSS file

const InvoiceExtractor = () => {
    const [activeTab, setActiveTab] = useState("current");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [section, setSection] = useState("invoice_header"); // default section

    // Handle file selection callback from FileUpload
    const handleFileSelect = (file) => {
        setUploadedFile(file);
    };

    const combinedData = result?.extraction_data?.combined_data || null;

    // Utility renderer (similar to your Streamlit loop)
    const renderSection = (sectionKey) => {
        if (!combinedData || !combinedData[sectionKey]) return <p>No data available</p>;

        const sectionData = combinedData[sectionKey];

        if (Array.isArray(sectionData)) {
            // Handle list type sections (like line items or terms)
            return (
                <div style={{textAlign : "left"}} className="description-cell">
                    {sectionData.map((item, i) => (
                        <div key={i} className="item-block">
                            {Object.entries(item).map(([key, value]) =>
                                value && value !== "N/A" ? (
                                    <p key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value}</p>
                                ) : null
                            )}
                            <hr />
                        </div>
                    ))}
                </div>
            );
        } else if (typeof sectionData === "object") {
            // Normal key-value pairs
            return (
                <div style={{textAlign : "left"}} className="description-cell">
                    {Object.entries(sectionData).map(([key, value]) =>
                        value && value !== "N/A" ? (
                            <p key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value}</p>
                        ) : null
                    )}
                </div>
            );
        } else {
            return <p>{sectionData}</p>;
        }
    };

    return (
        <div className="invoice-extractor">
            <h1 className="title">🧾 Invoice Data Extractor</h1>
            <p className="subtitle">
                Extract comprehensive data from invoices using OpenAI GPT-4o Vision
            </p>

            <hr className="divider" />

            <div className="main-content">
                {/* Left Panel - Upload Invoice */}
                <div className="upload-section">
                    <h2 className="section-title">
                        <Upload className="icon" /> 📤 Upload Invoice
                    </h2>
                    <p className="description">Choose an invoice image or PDF...</p>

                    <FileUpload onFileSelect={handleFileSelect} setResult={setResult} />
                </div>

                {/* Right Panel - Extracted Data */}
                <div className="extracted-data-section">
                    <div className="tabs">
                        <button
                            onClick={() => setActiveTab("current")}
                            className={`tab ${activeTab === "current" ? "active" : ""}`}
                        >
                            <BarChart3 className="icon-small" /> Current Results
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`tab ${activeTab === "history" ? "active" : ""}`}
                        >
                            <FolderOpen className="icon-small" /> Results History
                        </button>
                    </div>

                    <h2 className="section-title">
                        <BarChart3 className="icon" /> Extracted Data
                    </h2>

                    {!result && (
                        <StatusCard type="info">
                            <span>📄 Upload and process an invoice or PDF to see extracted data here</span>
                        </StatusCard>
                    )}

                    {result && combinedData && (
                        <div>
                            {/* Section Tabs (Scrollable) */}
                            <div className="section-tabs">
                                {[
                                    { key: "invoice_header", label: "📋 Invoice Header" },
                                    { key: "customer_details", label: "👤 Customer Details" },
                                    { key: "line_items", label: "📦 Line Items" },
                                    { key: "financial_summary", label: "💰 Financial Summary" },
                                    { key: "payment_details", label: "💳 Payment Details" },
                                    { key: "terms_and_conditions", label: "📜 Terms & Conditions" },
                                    { key: "additional_info", label: "ℹ️ Additional Info" },
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setSection(key)}
                                        className={`section-tab ${section === key ? "active" : ""}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Section Content */}
                            <div className="section-content">
                                {renderSection(section)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceExtractor;



{/* {result &&
                        <div className="json-container">
                            {
                                console.log("check", result)
                            }
                            <ReactJson
                                src={result?.extraction_data?.page_by_page_results || [] || []}
                                theme="rjv-default"
                                name={false}
                                collapsed={false}
                                enableClipboard={false}
                                displayDataTypes={false}
                                displayObjectSize={false}
                            />
                        </div>

                    } */}
