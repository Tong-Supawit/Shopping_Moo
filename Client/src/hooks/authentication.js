import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../features/userSlice";
import axios from "axios";

const useAuthentication = () => {

    const {role, isLogin} = useSelector(state => state.user);

    const [resultAuthentication, setResultAuthentication] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const isAuthenticated = async() => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/isAuthenticated`, {
                    withCredentials : true
                });
                console.log(response);
                dispatch(
                    login({
                        username : response.data.username,
                        role : response.data.role,
                    })
                )
                setResultAuthentication(true);
            }catch(err){
                dispatch(logout())
                setResultAuthentication(false);
                console.log("Unauthorized", err.response);
            }
        }
        isAuthenticated();
    }, [role, isLogin, dispatch]);
    return resultAuthentication;
}

export default useAuthentication;