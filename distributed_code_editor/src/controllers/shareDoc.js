import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const shareDoc = async (formData) => {
    console.log("shareDoc called ", formData)
    try {
        const response = await Api.postMethod(EndPoint.shareDoc, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};