import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { addToCart } from "../features/cartSlice";

import tongImage from "../img/moo.jpg"

function ProductDetail() {
    const dispatch = useDispatch();

    const {productID} = useParams();

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async() => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/${productID}`);
                setProduct(response.data.product);
                console.log(response.data.product);
            }catch(err){
                console.log("Fetch product detail error", err);
            }
        }
        fetchProductDetail();
    }, [productID])

    const handleAddToCart = async(productID) => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/addToCart`, {
                productId : productID,
                quantity : 1
            }, {
                withCredentials : true
            });
            console.log(response.data);
            dispatch(addToCart({
                cart : response.data.cart,
                totalPrice : response.data.totalPrice
            }));
        }catch(err){
            console.log("Add to cart error", err);
        }
    }

    return(

        <div>
            {!product ? (
                <div>Loading...</div>
            ) : (
                <div className="product-detail">
                    <h1>Product Detail</h1>
                    <img src={tongImage} alt="" style={{width : "500px"}}/>
                    <h2>Product name : {product.name}</h2>
                    <h2>Product description : {product.description}</h2>
                    <h2>Product price : {product.price}</h2>
                    <h2>Product stock : {product.stock}</h2>
                    <br />
                    <button onClick={() => handleAddToCart(productID)} className="cart-item__increase-btn">♡ Add to cart</button>
                    <button className="cart-item__increase-btn">♡ Buy now</button>
                </div>
            )}

        </div>
    )
}

export default ProductDetail;