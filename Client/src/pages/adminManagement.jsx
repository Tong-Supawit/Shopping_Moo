import { useEffect } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";

function AdminManagement() {

    const {role, isLogin} = useSelector(state => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        if(!isLogin || role !== "admin") {
            navigate("/")
        };
    }, [role, isLogin, navigate])

    return (
        <div>
            <h1>Admin Page</h1>
        </div>
    )
}

export default AdminManagement;