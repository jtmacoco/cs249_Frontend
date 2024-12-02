import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const fetchMyDocuments = async (formData) => {
    console.log("fetchshared called ", formData)
    try {
        const response = await Api.postMethod(EndPoint.myDocs, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};