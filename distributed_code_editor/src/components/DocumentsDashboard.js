import "../global.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../api";
import EndPoint from "./constants/Endpoints";
import { fetchshared } from "../controllers/FetchSharedDocs";

const DocumentsDashboard = ({ onLogout }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email= location.state?.email;

    // Redirect to login if email is missing
    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    // Fetch shared documents
    useEffect(() => {
        const fetchSharedDocuments = async () => {
            try {
                //console.log("Current User ", email)
                const data = {email: email}
                setLoading(true);
                console.log("sending email to backend", data)
                const response = await fetchshared(data);
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
    }, [email]);

    const handleOpenDocument = (docId) => {
        navigate(`/documentsDashboard/${docId}`);
    };

    const handleShareDocument = async (documentId) => {
        const recipient = prompt("Enter the email of the user you want to share this document with:");
        if (!recipient) {
            alert("Recipient email cannot be empty.");
            return;
        }

        setIsSharing(true);
        try {
            const url = EndPoint.getFullUrl(EndPoint.shareDoc);
            await Api.postMethod(url, { documentId, recipient });
            alert(`Document shared successfully with ${recipient}!`);

            // Refresh the shared documents list
            const sharedDocsUrl = EndPoint.getFullUrl(`${EndPoint.getSharedDoc}/${email}`);
            const response = await Api.getMethod(sharedDocsUrl);
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

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            navigate("/login");
        }
    };

    if (loading) return <div className="loader">Loading shared documents...</div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="documents-dashboard">
            <header className="dashboard-header">
                <h1>Shared Documents for {email}</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <p className="info-text">Click on a document to share it with another user.</p>
            {documents.length === 0 ? (
                <p className="empty-documents">No shared documents available.</p>
            ) : (
                <ul className="documents-list">
                    {documents.map((doc) => (
                        <li key={doc._id} className="document-item">
                            <span onClick={() => handleOpenDocument(doc._id)}>
                                {doc.name || "Untitled Document"}
                            </span>
                            <button onClick={() => handleShareDocument(doc._id)} disabled={isSharing}>
                                {isSharing ? "Sharing..." : "Share"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DocumentsDashboard;
