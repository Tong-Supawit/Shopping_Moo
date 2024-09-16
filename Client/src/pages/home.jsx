import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { fetchingProducts, fetchingProductsFailed, fetchingProductsSuccess, selectProduct } from "../features/productSlice";


function Home() {
    const dispatch = useDispatch();

    const {products, loading} = useSelector(state => state.products);

    useEffect(() => {
        const fetchProduct = async() => {
            try{
                dispatch(fetchingProducts());
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/fetchProduct`)
                dispatch(fetchingProductsSuccess({
                    products : response.data.products
                }))
            }catch(err){
                console.log("Fetch products error", err);
            }
        }
        fetchProduct();
    }, [dispatch])

    if(loading || !products.products){
        return(
            <div>
                <h1>Loading.....</h1>
            </div>
        )
    }

    return (
        <div>
            <h1>Home</h1>
            <ul>
                {products.products.map((products) => (   
                        <li key={products._id}>
                            <p>{products.name}</p>
                            <p>{products.description}</p>
                            <p>{products.price}</p>
                            <p>{products.stock}</p>
                        </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;