import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import { fetchingProducts, fetchingProductsSuccess} from "../features/productSlice";
import { addToCart } from "../features/cartSlice";

import tongImage from "../img/moo.jpg"


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

    const handleAddToCart = async(products) => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/addToCart`, {
                productId : products._id,
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
            <ul className="productContainer">
                {products.products.map((products) => (
                    <div className="product" key={products._id}>
                        <img src={tongImage} alt="" className="picture"/>
                            <li>
                                <p>Item : {products.name}</p>
                                <p>Description : {products.description}</p>
                                <p>Price : {products.price}</p>
                                <p>Stock : {products.stock}</p>
                                <button onClick={() => handleAddToCart(products)} className="cart-item__increase-btn">♡ Add to cart</button>
                                <button className="cart-item__increase-btn">♡ Buy now</button>
                                <Link to={`/product/${products._id}`}><button className="cart-item__increase-btn">♡ View details</button></Link>
                            </li>
                        </div>
                ))}
            </ul>
        </div>
    )
}

export default Home;