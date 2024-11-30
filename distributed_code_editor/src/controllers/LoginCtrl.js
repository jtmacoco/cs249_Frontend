import Api from "../api";
import EndPoint from "../components/constants/Endpoints";
export const loginHandleSubmit = async (formData) => {
    try {
        const response = await Api.postMethod(EndPoint.login, formData)
        return response
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};