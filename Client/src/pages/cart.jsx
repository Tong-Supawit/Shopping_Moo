import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { addToCart } from "../features/cartSlice";

function Cart() {
    const dispatch = useDispatch();

    const {products : items, totalPrice} = useSelector(state => state.cart);

    useEffect(() => {
        const showCart = async() => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/showCart`, {
            withCredentials : true
        })
        console.log(response);
        dispatch(addToCart({
            cart : response.data.cart,
            totalPrice : response.data.totalPrice
        }));
    }
        showCart();
    }, [dispatch])


    const increseItem = async(item) => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/increaseproduct`, {
                productId : item._id,
            }, {
                withCredentials : true
            });
            console.log(response);
            dispatch(addToCart({
                cart : response.data.cart,
                totalPrice : response.data.totalPrice
            }));
        }catch(err){
            console.log("Increse product error", err);
        }
    }

    const decreseItem = async(item) => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/decreaseproduct`, {
                productId : item._id,
            }, {
                withCredentials : true
            });
            console.log(response);
            dispatch(addToCart({
                cart : response.data.cart,
                totalPrice : response.data.totalPrice
            }));
        }catch(err){
            console.log("Increse product error", err);
        }
    }

    return(
        <div>
            <h1>This is cart</h1>
            {items.length > 0 ? 
            <div className="cart-container">
                {items.map(item => (
                    <div className="cart-item" key={item._id} >
                    <h2 className="cart-item__name">{item.product.name}</h2>
                    <p className="cart-item__quantity">{item.quantity}</p>
                    <button className="cart-item__increase-btn" onClick={() => increseItem(item)}>+</button>
                    <button className="cart-item__decrease-btn" onClick={() => decreseItem(item)}>-</button>
                    </div>
                ))}
                <p className="total-price">Total price : {totalPrice}</p>
            </div> : <p>No item on cart</p>}
        </div>
    )
}

export default Cart;