//import "../dashboard.css";
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
                if(!sharedResponse.data['message'])
                {
                    setDocuments(sharedResponse.data);
                }

                // Fetch user's own documents
                const myDocsResponse = await fetchMyDocuments(data);
                if (!myDocsResponse.data['message']) {
                    console.log("YES")
                    setMyDocuments(myDocsResponse.data);
                }
                
             
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
        <div className="documents-dashboard bg-dark_back bg-cover min-h-screen min-w-screen text-white">
             <nav className="bg-dark_border sticky top-0  h-14 flex items-center  ">
            <div key="navLinks reg" className="justify-center items-center mx-auto ">
                <p> Documents Dash Board For {email}</p>
            </div>
            <button onClick={handleLogout} className="logout-button text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Logout</button>
        </nav>
            <div className="pt-10 flex items-center justify-center mx-auto ">
                <div className="mb-4" >
                    <button
                        className={`tab ${activeTab === "my" ? "active" : ""} text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-20 mb-2 `}
                        onClick={() => setActiveTab("my")}
                    >
                        My Documents
                    </button>
                    <button
                        className={`tab ${activeTab === "shared" ? "active" : ""} text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2`}
                        onClick={() => setActiveTab("shared")}
                    >
                        Shared Documents
                    </button>
                </div>
            </div>
            {activeTab === "my" ? (
                myDocuments.length === 0 ? (
                    <p className="text-center text-lg">No documents available.</p>
                ) : (
                    <div class="px-12 relative overflow-x-auto">
                       <table className="w-full text-left rtl:text-right text-white">
                        <thead class="text-white bg-gray-50 dark:bg-gray-700">
                            <tr>
                                    <th className="text-center align-middle px-4 py-2 ">Document Name</th>
                                    <th className="text-center align-middle px-4 py-2 ">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-dark_border">
                                {myDocuments.map((doc) => (
                                    <tr key={doc._id}>
                                       <td className="text-center align-middle px-4 py-2">
                                            <button
                                                onClick={() => handleEditDocument(doc._id)}
                                                className="cursor-pointer hover:underline text-blue-500"
                                            >
                                                {doc.name || "Untitled Document"}
                                            </button>
                                            </td>
                                            <td className="text-center align-middle px-4 py-2">
                                            <button onClick={() => handleShareDocument(doc._id)} disabled={isSharing} className="hover:underline">
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
                    <p className="text-center text-lg">No shared documents available.</p>
                ) : (
                    <div class="px-12 relative overflow-x-auto">
                        <table className="w-full text-left rtl:text-right text-white">
                            <thead class="text-white bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="text-center align-middle px-4 py-2 ">Document Name</th>
                                    <th className="text-center align-middle px-4 py-2 ">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-dark_border">
                                {documents.map((doc) => (
                                    <tr key={doc._id}>
                                        <td className="text-center align-middle px-4 py-2">
                                            <button
                                                onClick={() => handleEditDocument(doc._id)}
                                                className="cursor-pointer hover:underline text-blue-500"
                                            >
                                                {doc.name || "Untitled Document"}
                                            </button>
                                        </td>
                                        <td className="text-center align-middle px-4 py-2">
                                            <button onClick={() => handleShareDocument(doc._id)} disabled={isSharing} className="hover:underline">
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
