import { Editor } from "@monaco-editor/react";
import './Document.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import io from 'socket.io-client';
function Document() {
    const [status, setStatus] = useState('Disconnected');
    const editorRef = useRef(null);
    const [socket, setSocket] = useState()
    const isRemoteUpdate = useRef(false); 
    const editorDidMount = (editor, monaco) => {
        console.log("Editor is mounted", editor);
        editorRef.current = editor;
    };

    useEffect(() => {
        const s = io('http://localhost:8000')
        setSocket(s)
        s.on('connect',()=>{
            setStatus('Connect')
        })
        s.on('disconnect',()=>{
            setStatus('Disconnect')
        })
        s.on('documentUpdate', (content) => {
            if (editorRef.current) {
                isRemoteUpdate.current=true
                editorRef.current.setValue(content);
            }
        });
        return () => {
            setStatus('Disconnect')
            s.disconnect()
        }
    }, [])
  const handleEditorChange = useCallback((value, event) => {
        if(isRemoteUpdate.current){
            isRemoteUpdate.current=false
            return
        }
        if (value.trim()&&socket) {
            console.log(value.trim())
            console.log("Emitting document update to server");
            socket.emit('documentUpdate', value.trim())
        }
    },[socket])
  
    return (
        <div>
            <div id="status">{status}</div>
            <Editor
                height="100vh"
                width="100%"
                theme="vs-dark"
                onChange={handleEditorChange}
                onMount={editorDidMount}
            />
        </div>
    )
}
export default Document