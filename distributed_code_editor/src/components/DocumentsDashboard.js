import "../dashboard.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchshared } from "../controllers/FetchSharedDocs";
import { shareDoc } from "../controllers/shareDoc";
import { fetchMyDocuments } from "../controllers/fetchMyDocuments"; // Import the new function

const DocumentsDashboard = ({ onLogout }) => {
    const [documents, setDocuments] = useState([]);
    const [myDocuments, setMyDocuments] = useState([]); // To store user's own documents
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const [activeTab, setActiveTab] = useState("shared"); // Tracks active tab: 'shared' or 'my'
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

    // Fetch documents
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = { email: email };
                setLoading(true);
                console.log("Fetching documents for email", data);

                // Fetch shared documents
                const sharedResponse = await fetchshared(data);
                setDocuments(sharedResponse.data);

                // Fetch user's own documents
                const myDocsResponse = await fetchMyDocuments(data);
                setMyDocuments(myDocsResponse.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("User not found or no documents available.");
                } else {
                    setError("Failed to fetch documents. Please check your network connection.");
                }
                console.error("Error fetching documents:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [email, refresh]);

    // Handle editing a document
    const handleEditDocument = (docId) => {
        navigate(`/documents/${docId}`);
    };

    // Handle sharing a document
    const handleShareDocument = async (documentId) => {
        const recipient = prompt("Enter the email of the user you want to share this document with:");
        if (!recipient) {
            alert("Recipient email cannot be empty.");
            return;
        }

        setIsSharing(true);
        try {
            const res = await shareDoc({ documentId, recipient });
            if (res.status === 200) {
                alert(res.data.message);
                setRefresh((prev) => !prev);
            } else {
                alert(res.message || "An error occurred while sharing the document.");
            }
        } catch (err) {
            alert("Error sharing the document. Please try again.");
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

    if (loading) return <div className="loader">Loading documents...</div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="documents-dashboard">
            <header className="dashboard-header">
                <h1>Documents Dashboard for {email}</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <div className="tabs-container">
                <button
                    className={`tab ${activeTab === "my" ? "active" : ""}`}
                    onClick={() => setActiveTab("my")}
                >
                    My Documents
                </button>
                <button
                    className={`tab ${activeTab === "shared" ? "active" : ""}`}
                    onClick={() => setActiveTab("shared")}
                >
                    Shared Documents
                </button>
            </div>
            {activeTab === "my" ? (
                myDocuments.length === 0 ? (
                    <p className="empty-documents">No documents available.</p>
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
                                {myDocuments.map((doc) => (
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
                )
            ) : (
                documents.length === 0 ? (
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
                )
            )}
        </div>
    );
};

export default DocumentsDashboard;
