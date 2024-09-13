import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

function UserDashboard() {

    const username = useSelector((state) => state.user.username);
    const role = useSelector((state) => state.user.role);

    //State for upload product form
    const [productname, setProductname] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productStock, setProductStock] = useState("");

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        if(productname.trim() === "" || productDescription.trim() === "" || productPrice.trim() === "" || productStock.trim() === ""){
            return console.log("All data are required");
        }
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/addProduct`, {
                productname,
                productDescription,
                productPrice,
                productStock
            }, {
                withCredentials : true
            })
            console.log(response.data);    
        }catch(err){
            console.log("Product created error", err);
        }
    }

    return (
        <div>
            <br />
            {username.trim() !== "" && <h1>{username.toUpperCase()}</h1>}
            {role.trim() !== "" && <h1>{role.toUpperCase()}</h1>}
            <br />
            <hr />
            <br />
            <h2>Upload product</h2>
            <br />
            <form action="" onSubmit={handleCreateProduct}>
                <h3>Producut name : </h3>
                <br />
                <input type="text" value={productname} onChange={(e) => setProductname(e.target.value)}/>
                <h3>Producut description : </h3>
                <br />
                <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)}/>
                <h3>Producut price : </h3>
                <br />
                <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)}/>
                <h3>Producut stock : </h3>
                <br />
                <input type="text" value={productStock} onChange={(e) => setProductStock(e.target.value)}/>
                <br />
                <br />
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default UserDashboard;