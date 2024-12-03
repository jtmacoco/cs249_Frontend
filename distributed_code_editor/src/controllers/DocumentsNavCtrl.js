import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const getDocumentName= async (formData) => {
    try {
        console.log("data")
        const response = await Api.postMethod(EndPoint.getDocument, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};