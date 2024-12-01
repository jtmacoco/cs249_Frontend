import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const fetchshared = async (formData) => {
    console.log("fetchshared called ", formData)
    try {
        const response = await Api.postMethod(EndPoint.getSharedDoc, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};