import { useEffect, useState } from "react";
import Api from "../api";
import { getDocumentName } from "../controllers/DocumentsNavCtrl";

export default function DocumentsNav({editorContent,document_id}) {
    const [docName,setDocName] = useState('')
    const getDocumentNames = async() =>{
        try{
            console.log("IN FUNC")
            const docName = await getDocumentName({_id:document_id})
            console.log("docName:",docName.data['data'])
            setDocName(docName.data['data'])
        }catch(error){
            throw error
        }
    }
    useEffect(() =>{
        getDocumentNames()
        console.log("DOC NAME:",docName)

    },[document_id])
    const downloadFile = () => {
        const blob = new Blob([editorContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'editorContent.py';//mayeb adjust for multiple extensions?
        link.click();
      };
    return (
        <nav className="bg-stone-600 flex sticky top-0 h-16 items-center py-4">
        <div className="flex justify-between w-full mx-12">
            <p className="text-white">{docName}</p>
            <button
            onClick={downloadFile}
                className="text-white bg-purple-800 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Download
            </button>
        </div>
    </nav>
    
    )
}