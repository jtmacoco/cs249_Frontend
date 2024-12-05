import React,{ useContext,useState,useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext)
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); 
    const [loading, setLoading] = useState(true);
    const getToken = () => localStorage.getItem("token");
    const saveToken = (token) => localStorage.setItem("token", token);
    const removeToken = () => localStorage.removeItem("token");
    const login = (user,token) =>{
        console.log("TOKEN SAVED")
        saveToken(token)
        console.log(user)
        setCurrentUser(user)
    }
    const logout = () => {
        console.log("TOKEN REMOVED")
        removeToken();
        setCurrentUser(null);
      };
    useEffect(() => {
        const token = getToken();
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded && decoded.exp * 1000 > Date.now()) {
            setCurrentUser(decoded); 
          } else {
            logout(); 
          }
        }
        setLoading(false); 
      }, []);
      const value = {
        currentUser,
        login,
        logout,
      };
    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      );
}