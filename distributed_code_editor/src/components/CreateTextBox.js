import { useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { textBoxHandleSubmit } from "../controllers/TextBoxCtrl"
export default function CreateTextBox({ handleTextBox, email }) {
    const [document, setDocument] = useState("")
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { email: email, name: document }
            setLoading(true)
            const response = await textBoxHandleSubmit(data)
            const docId = response.data['data']['_id']
            setLoading(false)
            setTimeout(() => {
                nav(`/documents/${docId}`);
            }, 500);
    } catch (error) {
        console.log("error in textBox:", error)
        setLoading(false)
    }

}
return (
    <div className="flex absolute bottom-1/2 inset-0 items-center justify-center z-10">
        <div className="relative rounded-md border border-neutral-500 p-20 bg-dark_border mx-auto">
            <div className="absolute top-0 left-0">
                <IoIosCloseCircleOutline size={25} onClick={handleTextBox} />
            </div>
            <form onSubmit={handleSubmit}>
                <div className=" text-black">
                    <input id="documentName" placeholder="document name" value={document} onChange={(e) => setDocument(e.target.value)} className="rounded-md p-2 pr-10 bg-slate-100" />
                </div>
                <div className="pt-4">
                    <button disabled={loading} type="submit" className="text-white bg-purple-800 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Create Document</button>
                </div>
            </form>
        </div>
    </div>
)
}