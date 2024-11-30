import React, { useEffect, useState } from "react";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
import { registerHandleSubmit } from "../controllers/RegisterCtrl";
function Register() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            const pack = { username: username, email: email, password: password }
            setLoading(true)
            const res = await registerHandleSubmit(pack)
            if (!res.data['success']) {
                const errorMessage = res.data['message']
                setLoading(false)
                return setError(errorMessage)
            }
            nav("/")
        } catch (e) {
            setError(e.message || "failed to create account")
        }
        setLoading(false)
        setUsername("")
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [error]);
    return (
        <div className="bg-dark_back  h-screen flex justify-center items-center flex-col">
            {error && (
                <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xs break-words" role="alert">
                    <strong className="font-bold">{error}</strong>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" />
                </div>

            )
            }
            <div className="rounded-md border border-neutral-500 p-20 bg-dark_border">
                <h1 className="text-center text-4xl font-mono pb-14 text-white">Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="pb-10">
                        <input id="email" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="text-black rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-10">
                        <input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-10">
                        <input type="password" id="password" placeholder="Password" onChange={(p) => setPassword(p.target.value)} value={password} className="text-black rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-6">
                        <input type="password" id="confirm_password" placeholder="Confirm Password" onChange={(p) => setConfirmPassword(p.target.value)} value={confirmPassword} className="text-black rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-4">
                        <button disabled={loading} type="submit" className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Submit</button>
                    </div>
                </form>
                <Link to="/">
                    <button type="button" className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Login</button>
                </Link>
            </div>
        </div>
    )
}
export default Register