import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Document from './components/Document/Document';
import Login from './components/Login';
import Register from './components/Register';
import DocumentsDashboard from './components/DocumentsDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
//import { v4 as uuidV4 } from 'uuid'
//<Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <Login />
          } />
          <Route path="/documents/:DocId" element={
            <PrivateRoute>
              <Document />
            </PrivateRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/documentsDashboard" element={
            <PrivateRoute>
              <DocumentsDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
