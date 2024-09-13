import { useState } from "react";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

    const handleRegister = async(e) => {
        e.preventDefault();
        if(username.trim() === "" || password.trim() === ""){
            return console.log("Username or Password is required");
        }
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
                username,
                email,
                password,
                address
            }, {
                withCredentials : true
            })
            console.log("Register successful", response);
        }catch(err){
            console.log("Register failed", err);
        }
    }

    return (
        <div className="registerLoginForm">
        <form action="" onSubmit={handleRegister}>
                <h3>Username : </h3>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <h3>Email : </h3>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <h3>Password : </h3>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <h3>Address : </h3>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}/>
                <br/>
                <br/>
                <button>Register</button>
       </form>
    </div>
    )
}

export default Register;