import "../global.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginHandleSubmit } from "../controllers/LoginCtrl";
function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const nav = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!email || !password){
            return setError("fields cannot be left blank")
        }
        try {
            const pack = { email: email, password: password}
            console.log(pack)
            setLoading(true)
            const res = await loginHandleSubmit(pack)
            if (!res.data['success']) {
                const errorMessage = res.data['message']
                setLoading(false)
                return setError(errorMessage)
            }
            console.log("Navigating to Document Dashboard")
            console.log("email = ", {email: res.data['data']})
            nav("/documentsDashboard", {state: {email: res.data['data']}})
        } catch (e) {
            setError(e.message || "failed to create account")
        }
        setLoading(false)
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
                <h1 className="text-center text-4xl font-mono pb-14 text-white">Code Editor Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="pb-10 text-black">
                        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-md p-2 pr-10 bg-slate-200" />
                    </div>
                    <div className="pb-6 text-black">
                        <input id="password" value={password} onChange={(p) => setPassword(p.target.value)} type="password" placeholder="Password" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-4">
                        <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 ">Login</button>
                    </div>
                    <div>
                        <Link to="/register">
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Create Account</button>
                        </Link>
                    </div>
                    <div className="">
                        {/* add this later <Link to="/ForgotPassword">
                            <button><p className="text-blue-500">Forgot Password</p></button>
                        </Link>*/}
                    </div>
                </form>
            </div>

        </div>
    )
}
export default Login