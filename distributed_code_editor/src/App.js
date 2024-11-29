import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Document from './components/Document/Document';
import Login from './components/Login';
import Register from './components/Register';
import { v4 as uuidV4 } from 'uuid'
//<Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/documents/:DocId" element={<Document/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
