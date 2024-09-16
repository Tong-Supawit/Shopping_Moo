import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products : [],
    loading : false,
    error : null,
    selectProduct : null
}

const productSlice = createSlice({
    name : "products",
    initialState,
    reducers : {
        fetchingProducts : (state) => {
            state.loading = true;
        },
        fetchingProductsSuccess : (state, action) => {
            state.products = action.payload;
            state.loading = false;
        },
        fetchingProductsFailed : (state) => {
            state.error = true;
            state.loading = false;
        },
        selectProduct : (state, action) => {
            state.selectProduct = action.payload;
        }
    }
});

export const {fetchingProducts, fetchingProductsSuccess, fetchingProductsFailed, selectProduct} = productSlice.actions;
export default productSlice.reducer;