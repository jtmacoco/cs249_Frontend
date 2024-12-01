import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DocumentsDashboard.css";

const DocumentsDashboard = ({ username }) => {
    const [documents, setDocuments] = useState([]); // List of shared documents
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error message
    const [isSharing, setIsSharing] = useState(false); // State for sharing document
    const navigate = useNavigate(); // React Router navigation

    // Fetch shared documents from the backend
    useEffect(() => {
        const fetchSharedDocuments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/user/${username}/shared-docs`);
                setDocuments(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("User not found or no documents shared.");
                } else {
                    setError("Failed to fetch shared documents. Please check your network connection.");
                }
                console.error("Error fetching shared documents:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedDocuments();
    }, [username]);

    // Navigate to the Document editor
    const handleOpenDocument = (docId) => {
        navigate(`/documentsDashboard/${docId}`);
    };

    // Share a document with another user
    const handleShareDocument = async () => {
        const documentId = prompt("Enter the Document ID to share:");
        if (!documentId || !/^[a-f\d]{24}$/i.test(documentId)) {
            alert("Invalid Document ID. Please try again.");
            return;
        }

        setIsSharing(true);
        try {
            await axios.post(`/api/user/${username}/share-doc`, { documentId });
            alert("Document shared successfully!");

            // Refresh the documents list
            const response = await axios.get(`/api/user/${username}/shared-docs`);
            setDocuments(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert("Document not found. Please ensure the Document ID is correct.");
            } else {
                alert("Error sharing the document. Please try again.");
            }
            console.error("Failed to share document:", err);
        } finally {
            setIsSharing(false);
        }
    };

    // Render a loading spinner if the data is still being fetched
    if (loading) return <div className="loader">Loading shared documents...</div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="documents-dashboard">
            <h1>Shared Documents for {username}</h1>
            <button onClick={handleShareDocument} disabled={isSharing}>
                {isSharing ? "Sharing..." : "Share a Document"}
            </button>
            {documents.length === 0 ? (
                <p className="empty-documents">No shared documents available.</p>
            ) : (
                <ul className="documents-list">
                    {documents.map((doc) => (
                        <li key={doc._id} className="document-item">
                            <span>{doc.name || "Untitled Document"}</span>
                            <button onClick={() => handleOpenDocument(doc._id)}>Open</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DocumentsDashboard;
