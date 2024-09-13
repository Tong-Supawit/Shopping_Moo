import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username : "",
    role : "",
    isLogin : false,
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        login : (state, action) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.isLogin = true;
        },
        logout : (state) => {
            state.username = "";
            state.role = "";
            state.isLogin = false;        
        }
    }
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;