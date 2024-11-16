import { Editor } from "@monaco-editor/react";
import './Document.css'
import { useEffect, useState, useRef} from 'react'
import io from 'socket.io-client';
function Document() {
    const [status, setStatus] = useState('Disconnected');
    const editorRef = useRef(null);
    const [socket, setSocket] = useState()
    const isRemoteUpdate = useRef(false);
    const editorDidMount = (editor, monaco) => {
        //console.log("Editor is mounted", editor);
        editorRef.current = editor;
    };

    useEffect(() => {
        const s = io('http://localhost:8000')
        setSocket(s)
        s.on('connect', () => {
            setStatus('Connect')
        })
        s.on('disconnect', () => {
            setStatus('Disconnect')
        })
        s.on('documentUpdate', (content) => {
            if (editorRef.current) {
                isRemoteUpdate.current = true
                editorRef.current.setValue(content);
            }
        });
        return () => {
            setStatus('Disconnect')
            s.disconnect()
        }
    }, [])
    const debounce = (func, delay) => {
        let timer
        return ((...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => func(...args), delay)
        })
    }
    const handleEditorChange =
        debounce((value) => {
            if (isRemoteUpdate.current) {
                isRemoteUpdate.current = false
                return
            }
            console.log(value)
            if (socket) {
                socket.emit('documentUpdate', value.trim())
            }
        },300)

    return (
        <div>
            <div id="status">{status}</div>
            <Editor
                height="100vh"
                width="100%"
                theme="vs-dark"
                onChange={handleEditorChange}
                onMount={editorDidMount}
                language="python"
            />
        </div>
    )
}
export default Document