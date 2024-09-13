import { useState } from "react";
import axios from "axios";
import { login } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");


    const handleLogin = async(e) => {
        e.preventDefault();
        if(loginUsername.trim() === "" || loginPassword.trim() === ""){
            return console.log("loginUsername or loginPassword is required");
        }
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                username : loginUsername,
                password : loginPassword,
            }, {
                withCredentials : true
            })
            dispatch(
                login({
                    username : response.data.username,
                    role : response.data.role,
                    isLogin : response.data.isLogin
                })
            )
            navigate("/userDashboard")
            console.log("Login successful", response.data);
        }catch(err){
            console.log("Login failed", err);
        }
    }

    return (
            <div className="registerLoginForm">
                <form action="" onSubmit={handleLogin}>
                <h3>Username : </h3>
                <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)}/>
                <h3>Password : </h3>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
                <br/>
                <br/>
                <button>Login</button>
                </form>
        </div>
    );
};

export default Login;