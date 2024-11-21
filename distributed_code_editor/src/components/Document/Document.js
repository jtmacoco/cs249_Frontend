import { Editor } from "@monaco-editor/react";
import './Document.css'
import { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid'
import VectorClock from "../../algorithms/vectorClock/VectorClock";
function Document() {
    const [status, setStatus] = useState('Disconnected');
    const editorRef = useRef(null);
    const [socket, setSocket] = useState()
    const isRemoteUpdate = useRef(false);
    const updateBuffer = useRef([])
    const editorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        while (updateBuffer.current.length > 0) {
            const content = updateBuffer.current.shift()//basically popleft
            isRemoteUpdate.current = true;
            editor.setValue(content)
        }
    };

    const { DocId } = useParams();
    const uidRef = useRef(uuidV4());  // Initialize the UUID once
    const uid = uidRef.current;
    let vc = new VectorClock(DocId)
    vc.checkInVec(uid)
    useEffect(() => {
        const s = io('http://localhost:8000')
        setSocket(s)
        s.on('connect', () => {
            setStatus('Connect')
            s.emit('joinDocument', { DocId: DocId, uid: uid });
        })
        s.on('disconnect', () => {
            setStatus('Disconnect')
        })
        s.on('documentUpdate', (content) => {
            if (editorRef.current) {
                isRemoteUpdate.current = true
                editorRef.current.setValue(content);
            }
            else {
                updateBuffer.current.push(content)
            }
        });
        return () => {
            s.disconnect()
        }
    }, [DocId])//add uid to this later
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
            if (socket) {
                vc.event(uid)
                const sendVc = vc.send(uid)
                const pack = { value, DocId, uid, sendVc }
                socket.emit('documentUpdate', pack)
            }
        }, 300)

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