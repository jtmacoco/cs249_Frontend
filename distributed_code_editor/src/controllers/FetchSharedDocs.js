import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const fetchshared = async (formData) => {
    console.log("fetchshared called")
    try {
        console.log(formData)
        const response = await Api.getMethod(EndPoint.getSharedDoc, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};