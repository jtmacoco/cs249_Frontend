import "../dashboard.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../api";
import EndPoint from "./constants/Endpoints";
import { fetchshared } from "../controllers/FetchSharedDocs";
import { shareDoc } from "../controllers/shareDoc";



const DocumentsDashboard = ({ onLogout }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const [refresh, setRefresh] = useState(false);

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
                const data = { email: email };
                setLoading(true);
                console.log("Sending email to backend", data);
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
    }, [email, refresh]);

    // Handle editing the document
    const handleEditDocument = (docId) => {
        console.log(docId)
        navigate(`/documents/${docId}`);
    };

    // Handle sharing the document
    const handleShareDocument = async (documentId) => {
        const recipient = prompt("Enter the email of the user you want to share this document with:");
        if (!recipient) {
            alert("Recipient email cannot be empty.");
            return;
        }

        setIsSharing(true);
        try {
            //await Api.postMethod(url, { documentId, recipient });
            const res = await shareDoc({ documentId, recipient });
            console.log(res.data.message)
            if (res.status === 200) {
                // Handle success cases
                alert(res.data.message);
                setRefresh((prev) => !prev);
            } else {
                // Handle error cases
                if (res.status === 404) {
                    alert(res.message || "User or document not found.");
                } else if (res.status === 500) {
                    alert(res.message || "An error occurred while sharing the document.");
                } else {
                    alert("An unknown error occurred.");
                }
            }

            // Refresh the shared documents list
            
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
            navigate("/");
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
            <p className="info-text">Click on a document name to edit it or click "Share" to share it with another user.</p>
            {documents.length === 0 ? (
                <p className="empty-documents">No shared documents available.</p>
            ) : (
                <div className="table-container">
                    <table className="documents-table">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc._id}>
                                    <td
                                        onClick={() => handleEditDocument(doc._id)}
                                        style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                                    >
                                        {doc.name || "Untitled Document"}
                                    </td>
                                    <td>
                                        <button onClick={() => handleShareDocument(doc._id)} disabled={isSharing}>
                                            {isSharing ? "Sharing..." : "Share"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DocumentsDashboard;
