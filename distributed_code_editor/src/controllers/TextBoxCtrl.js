import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const textBoxHandleSubmit = async (formData) => {
    try {
        const response = await Api.postMethod(EndPoint.createDocument, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};
