import { Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";
import axios from "axios";

function Navbar() {
    const dispatch = useDispatch();
    
    const {username, role, isLogin} = useSelector(state => state.user);

    const handleLogout = async() => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
                withCredentials : true
            })
            dispatch(logout());
            console.log("Logout successful", response.data);
        }catch(err){
            console.log("Logout error", err);
        }
    }

    return (
        <div className="navbar">
            <ul>
                <li>
                    <Link to={"/"}>HOME</Link>
                    {role === "admin" && <Link to={"/adminManagement"}>ADMIN MANAGEMENT</Link>}
                    {!isLogin && <Link to={"/login"}>LOGIN</Link>}
                    {!isLogin && <Link to={"/register"}>REGISTER</Link>}
                    {username.trim() !== "" && <Link to={"/userDashboard"}>{username.toUpperCase()}</Link>}
                    {isLogin && <Link to={"/"} onClick={handleLogout}>LOGOUT</Link>}
                </li>
            </ul>
        </div>
    )
}

export default Navbar;