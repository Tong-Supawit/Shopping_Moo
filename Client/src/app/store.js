import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";

const store = configureStore({
    reducer : {
        user : userReducer,
        products : productReducer,
    }
});

export default store;
