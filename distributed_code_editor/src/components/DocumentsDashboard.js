import "../global.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DocumentsDashboard = ({ username, onLogout }) => {
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
    const handleShareDocument = async (documentId) => {
        const recipient = prompt("Enter the username of the user you want to share this document with:");
        if (!recipient) {
            alert("Recipient username cannot be empty.");
            return;
        }

        setIsSharing(true);
        try {
            await axios.post(`/api/user/${username}/share-doc`, { documentId, recipient });
            alert(`Document shared successfully with ${recipient}!`);

            // Refresh the documents list
            const response = await axios.get(`/api/user/${username}/shared-docs`);
            setDocuments(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert("Error: Document or recipient not found.");
            } else {
                alert("Error sharing the document. Please try again.");
            }
            console.error("Failed to share document:", err);
        } finally {
            setIsSharing(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        if (onLogout) {
            onLogout(); // Trigger logout callback
        } else {
            navigate("/login"); // Redirect to login page
        }
    };

    // Render a loading spinner if the data is still being fetched
    if (loading) return <div className="loader">Loading shared documents...</div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="documents-dashboard">
            <header className="dashboard-header">
                <h1>Shared Documents for {username}</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>
            <p className="info-text">Click on a document to share it with another user.</p>
            {documents.length === 0 ? (
                <p className="empty-documents">No shared documents available.</p>
            ) : (
                <ul className="documents-list">
                    {documents.map((doc) => (
                        <li
                            key={doc._id}
                            className="document-item"
                            onClick={() => handleShareDocument(doc._id)}
                        >
                            <span>{doc.name || "Untitled Document"}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DocumentsDashboard;
