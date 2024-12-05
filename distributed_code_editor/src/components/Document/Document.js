import { Editor } from "@monaco-editor/react";
import './Document.css'
import { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid'
import VectorClock from "../../algorithms/vectorClock/VectorClock";
import CrdtRga from "../../algorithms/crdt/crdt";
import DocumentsNav from "../DocumentsNav";
function Document() {
    const [status, setStatus] = useState('Disconnected');
    const [documentState, setDocumentState] = useState('')
    const editorRef = useRef(null);
    const conflictRef = useRef(null);
    const monacoRef = useRef(null)
    const socket = useRef(null)
    const isRemoteUpdate = useRef(true);
    const updateBuffer = useRef([])
    const { DocId } = useParams();
    const crtdRef = useRef(new CrdtRga("", DocId));
    const uidRef = useRef(uuidV4());// change this to current user now
    const uid = uidRef.current;
    const vcRef = useRef(new VectorClock(String(DocId)));
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
                //console.log("NOT REMOTE")
                //vcRef.current.event(uid)
                const changes = event.changes.map((change) => ({
                    range: change.range,
                    text: change.text,
                    type: change.text.length > 0 ? "insert" : "delete",
                }));
                accumulatedChanges.push(...changes)
                debounceBatch();
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
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    useEffect(() => {
        vcRef.current.checkInVec(uid)
        vcRef.current.reset()

        const s = io('http://3.130.25.213:4000/', { autoConnect: true })
        socket.current = s
        s.on('disconnect', () => {
            setStatus('Disconnect')
        })
        s.on('connect', () => {
            setStatus('Connect')
            s.emit('joinDocument', { DocId: DocId, uid: uid });
        })

        s.on('firstJoin', ({ docData, vectorClock }) => {
            //console.log("ACUMULATED CHANGES:",accumulatedChanges)
            const content = docData
            vcRef.current.receive(vectorClock)
            const update = content ? content : ""
            if (editorRef.current) {
                editorRef.current.setValue(update);
            }
            //else {
            //updateBuffer.current.push(update)
            //}
            accumulatedChanges = []
        })

        s.on('documentUpdate', ({ content, vectorClock, conflict }) => {

            let changes = content
            conflictRef.current = conflict
            const m = crtdRef.current.convert(changes)

            const allContainNewline = content.every(change => change.text.includes('\n'));
            vcRef.current.receive(vectorClock)
            if (editorRef.current) {
                const model = editorRef.current.getModel();
                isRemoteUpdate.current = true
                changes.forEach((change) => {
                    let { type, range, text } = change
                    let lineCount = model.getLineCount()
                    if (lineCount < range.startLineNumber && m.length > 1 && !allContainNewline) {//copy past multiple lines even when other users don't have those lines
                        const additionalLines = "\n"
                        model.applyEdits([
                            {
                                range: new monacoRef.current.Range(range.startLineNumber, model.getLineMaxColumn(lineCount), range.startLineNumber, model.getLineMaxColumn(lineCount)),
                                text: additionalLines,
                            },
                        ]);
                    }

                    editorRef.current.executeEdits('remoteUpdate', [{
                        range: new monacoRef.current.Range(
                            range.startLineNumber,
                            range.startColumn,
                            range.endLineNumber,
                            range.endColumn + accumulatedChanges.length,
                        ),
                        text: type === 'insert' ? text : '',
                    }])

                })
                isRemoteUpdate.current = false
            }
        });
        return () => {
            s.disconnect()
        }
    }, [DocId, uid, socket])
    const debounceBatch = debounce(() => {
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false
            return
        }
        console.log(socket, socket.current['connected'])
        if (accumulatedChanges.length > 0 && socket.current['connected']) {
            console.log("IN THE IF ")
            setDocumentState(editorRef.current.getValue())
            const vcSend = vcRef.current.send(uid)
            const curTime = Math.floor(Date.now() / 1000);
            const pack = { changes: accumulatedChanges, DocId: DocId, uid: uid, vc: vcSend, curTime: curTime }
            socket.current.emit('documentUpdate', pack);
            accumulatedChanges = [];
        }
    }, 300);
    return (
        <div>
            <DocumentsNav document_id={DocId} editorContent={documentState} />
            <div>{status}</div>
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