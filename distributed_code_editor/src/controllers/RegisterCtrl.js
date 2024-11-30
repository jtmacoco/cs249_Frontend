import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const registerHandleSubmit = async (formData) => {
    try {
        const response = await Api.postMethod(EndPoint.register, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};
