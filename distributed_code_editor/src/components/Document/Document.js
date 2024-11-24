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
    const monacoRef = useRef(null)
    const socket = useRef(null)
    const isRemoteUpdate = useRef(false);
    const updateBuffer = useRef([])
    const { DocId } = useParams();
    const uidRef = useRef(uuidV4());
    const uid = uidRef.current;
    const vcRef = useRef(new VectorClock(String(DocId)));
    //let vc = new VectorClock(DocId)//can make reference 
    //vc.checkInVec(uid)
    let accumulatedChanges = [];
    const debounce = (func, delay) => {
        let timer
        return ((...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => func(...args), delay)
        })
    }
    const editorDidMount = (editor, monaco) => {
        editorRef.current = editor
        monacoRef.current = monaco
        editor.onDidChangeModelContent((event) => {
            if (!isRemoteUpdate.current) {
                vcRef.current.event(uid)
                const changes = event.changes.map((change) => ({
                    range: change.range,
                    text: change.text,
                    type: change.rangeLength === 0 ? "insert" : "delete",
                }));
                accumulatedChanges.push(...changes)
                debounceBatch(changes);
            }
        });
        while (updateBuffer.current.length > 0) {
            const content = updateBuffer.current.shift()//basically popleft
            isRemoteUpdate.current = true;
            editor.setValue(content)
        }
        isRemoteUpdate.current = false;
    };
    useEffect(() => {
        vcRef.current.checkInVec(uid)
        const s = io('http://localhost:8000')
        socket.current = s
        s.on('connect', () => {
            setStatus('Connect')
            s.emit('joinDocument', { DocId: DocId, uid: uid });
        })
        s.on('disconnect', () => {
            setStatus('Disconnect')
        })
        s.on('firstJoin', ({docData, vectorClock}) => {
            const content=docData
            vcRef.current.receive(vectorClock)
            const update = content ? content : ""
            if (editorRef.current) {
                editorRef.current.setValue(update);
            }
            else {
                updateBuffer.current.push(update)
            }
        })
        s.on('documentUpdate', ({content,vectorClock}) => {
            const  changes  = content
            vcRef.current.receive(vectorClock)
            if (editorRef.current) {
                isRemoteUpdate.current = true
                changes.forEach((change) => {
                    const { type, range, text } = change
                    editorRef.current.executeEdits('remoteUpdate', [{
                        range: new monacoRef.current.Range(
                            range.startLineNumber,
                            range.startColumn,
                            range.endLineNumber,
                            range.endColumn,
                        ),
                        text: type==='insert'? text:'',
                    }])

                })
                isRemoteUpdate.current = false
                //editorRef.current.setValue(update);
            }
        });
        return () => {
            s.disconnect()
        }
    }, [DocId, uid, socket])//add uid to this later
    const debounceBatch = debounce(() => {
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false
            return
        }
        if (accumulatedChanges.length > 0) {
            const vcSend = vcRef.current.send(uid)
            const pack = { changes: accumulatedChanges, DocId: DocId, uid: uid, vc: vcSend}
            socket.current.emit('documentUpdate', pack);
            accumulatedChanges = [];
        }
    }, 300);
    return (
        <div>
            <div id="status">{status}</div>
            <Editor
                height="100vh"
                width="100%"
                theme="vs-dark"
                onMount={editorDidMount}
                language="python"
            />
        </div>
    )
}
export default Document