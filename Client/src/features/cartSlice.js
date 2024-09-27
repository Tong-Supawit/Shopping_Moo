import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState ={
    products : [],
    totalPrice : 0
}

const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {
        addToCart : (state, action) => {
            state.products = action.payload.cart;
            state.totalPrice = action.payload.totalPrice;
        }
    }
});

export const {addToCart} = cartSlice.actions;

export default cartSlice.reducer;