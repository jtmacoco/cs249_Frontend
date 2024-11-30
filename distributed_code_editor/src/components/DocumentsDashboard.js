import "../global.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const DocumentsDashboard = ({ username }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Fetch shared documents from the backend
    useEffect(() => {
        const fetchSharedDocuments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/user/${username}/shared-docs`);
                setDocuments(response.data);
            } catch (err) {
                setError("Failed to fetch shared documents.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedDocuments();
    }, [username]);

    const handleOpenDocument = (docId) => {
        //Navigate to the document editor (replace with your document editor route)
        window.location.href = `/editor/${docId}`;
    };

    const handleShareDocument = async () => {
        const documentId = prompt("Enter the Document ID to share:");
        if (!documentId) return;

        try {
            await axios.post(`/api/user/${username}/share-doc`, { documentId });
            alert("Document shared successfully!");
            //Refresh the documents list
            const response = await axios.get(`/api/user/${username}/shared-docs`);
            setDocuments(response.data);
        } catch (err) {
            console.error("Failed to share document:", err);
            alert("Error sharing the document. Please try again.");
        }
    };

    if (loading) return <p>Loading shared documents...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="documents-dashboard">
            <h1>Shared Documents for {username}</h1>
            <button onClick={handleShareDocument}>Share a Document</button>
            {documents.length === 0 ? (
                <p>No shared documents available.</p>
            ) : (
                <ul className="documents-list">
                    {documents.map((doc) => (
                        <li key={doc._id} className="document-item">
                            <span>{doc.name}</span>
                            <button onClick={() => handleOpenDocument(doc._id)}>Open</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DocumentsDashboard;
