import { useEffect } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";

import useAuthentication from "../hooks/authentication";

function AdminManagement() {

    const {role, isLogin} = useSelector(state => state.user);

    const navigate = useNavigate();

    // const isAuthenticated = useAuthentication();

    // console.log(isAuthenticated);

    useEffect(() => {
        if(!isLogin || role !== "admin") {
            navigate("/")
        };
    }, [role, isLogin, navigate])

    // if(!isAuthenticated){
    //     return (
    //         <div>
    //             Loading...
    //         </div> 
    //     )
    // }

    return (
        <div>
            <h1>Admin Page</h1>
        </div>
    )
}

export default AdminManagement;