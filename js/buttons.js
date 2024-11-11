function formatText(command) {
    document.execCommand(command, false, null);
}

//temp function to save as txt
function saveContent() {
    const content = document.getElementById('editor').innerHTML;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.txt';
    link.click();
}