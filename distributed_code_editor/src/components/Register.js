import React, { useEffect, useState } from "react";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
function Register() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const handleSubmit = async (e) => {

    }
    return (
        <div className="bg-dark_back  h-screen flex justify-center items-center flex-col">
            <div className="rounded-md border-neutral-500 p-20 bg-dark_border">
                <h1 className="text-center text-5xl pb-14 text-black dark:text-white">Create Account</h1>
                <form onSubmit={handleSubmit}>
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
                        <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Next</button>
                    </div>
                </form>
                <Link to="/">
                    <button type="button" class="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Login</button>
                </Link>
            </div>
        </div>
    )
}
export default Register