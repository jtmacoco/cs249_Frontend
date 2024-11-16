import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Document from './components/Document/Document';
import { v4 as uuidV4 } from 'uuid'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        <Route path="/documents/:id" element={<Document />} />
      </Routes>
    </Router>
  );
}

export default App;
