const editorDiv = document.getElementById('editor')
const socket = io('http://localhost:8000');
socket.on('connect', () => {
    document.getElementById('status').textContent = 'Connected';
    console.log("Connected to Server");
})
socket.on('disconnect', () => {
    document.getElementById('status').textContent = 'Disconnected'
    console.log("Disconnected to Server");
})
socket.on('documentUpdate', (content) => {
    editorDiv.innerHTML = content
})
editorDiv.addEventListener('input', () => {
    const content = editorDiv.innerHTML.trim();
    if (content) {
        socket.emit('documentUpdate', content)
    }
})