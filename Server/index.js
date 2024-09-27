require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {User, Product, Cart} = require("./dataModelMongoDB");

const app = express();

app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    console.log(process.env.CLIENT_URL);
    res.send("Hello world");
});

app.get("/isAuthenticated", async(req, res) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message : "Unauthorized"})
    }
    try{
        const user = await jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
        res.status(200).json({message : "User logined", username : user.username, role : user.role});
    }catch(err){
        return res.status(401).json({message : "Internal server error"})
    }
});

app.post("/register", async(req, res) => {
    const {username, email, password, address} = req.body;
    if(username.trim() === "" || password.trim() === ""){
        return res.status(400).json({error : "Username or Password is required"});
    }
    try{
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error : "Username already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password : hashedPassword, address});
        await newUser.save();
        res.status(200).json({message : "User created successfully"});
    }catch(err){
        res.status(400).json({err : err.message});
    }
});

app.post("/login", async(req, res) => {
    const {username, password} = req.body;
    if(username.trim() === "" || password.trim() === ""){
        return res.status(400).json({error : "Username or Password is required"});
    }
    try{
        const user = await User.findOne({username : username.trim()});
        if(!user){
            return res.status(404).json({err : "User not found"});
        }try{
            const passwordValidation = await bcrypt.compare(password.trim(), user.password);
            if(!passwordValidation) return res.status(400).json({err : "Invalid password"});
            const accesstoken = jwt.sign({_id : user._id, username : user.username, role : user.role}, process.env.ACCESS_JWT_SECRET, {expiresIn : "1h"});
            res.cookie("accessToken", accesstoken, {maxAge : 18000000, httpOnly : true, secure : false, sameSite : "lax"});
            res.status(200).json({message : "Login succesfull", username : user.username, role : user.role});
        }catch(err){
            res.status(400).json({err : "Internal server error"});
        }
        
    }catch(err){
        res.status(400).json({err : err.message});
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.status(200).json({message : "Logout successful"})
    console.log("Logout successful")
})

app.get("/fetchProduct", async(req, res) => {
    try{
        const products = await Product.find({});
        return res.status(200).json({message : "Fetch products successful", products});
    }catch(err){
        console.log("Fetch products error", err);
        return res.status(400).json({err : "Fetch products error"});
    }
})

app.get("/product/:productID", async(req, res) => {
    try{
        const {productID} = req.params;
        const product = await Product.findById(productID);
        res.status(200).json({message : "Fetch product detail successful", product});
    }catch(err){
        console.log("Fetch product detail error", err);
        res.status(400).json({err : "Fetch product detail erro"});
    }
})

app.post("/addProduct", async(req, res) => {
    try{
        const {productname, productDescription, productPrice, productStock} = req.body;
        if(productname.trim() === "" || productDescription.trim() === "" || productPrice.trim() === "" || productStock.trim() === ""){
            return res.status(400).json({message : "All data are required"});
        };
        const checkProduct = await Product.findOne({name : productname.trim()});
        if(checkProduct) return res.status(400).json({message : "Name of product already exists"});
        const createdProduct = new Product({name : productname, description : productDescription, price : productPrice, stock : productStock});
        await createdProduct.save();
        res.status(200).json({message : "Product created successfully"});
    }catch(err){
        console.log("Product created error", err);
        res.status(400).json({err : err.message})
    }
})

app.get("/showCart", async(req, res) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message : "Unauthorized"})
    }
    try{
        const user = await jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
        let cart = await Cart.findOne({user : user._id});
        cart = await Cart.findOne({user : user._id}).populate("items.product");
        return res.status(200).json({message : "Add to cart successful", cart : cart.items, totalPrice : cart.totalPrice});
    }catch(err){
        console.log("Show cart error", err);
    }
})

app.post("/addToCart", async(req, res) => {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({message : "Unauthorized"})
        }
        try{
            const user = await jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
            let cart = await Cart.findOne({user : user._id});
            const {productId, quantity} = req.body;
            if(!cart){
                const product = await Product.findById(productId);
                cart = new Cart({
                    user : user._id,
                    items : [{
                        product : productId,
                        quantity : quantity
                    }],
                    totalPrice : quantity * product.price
                })
                await cart.save();
                cart = await Cart.findOne({user : user._id}).populate("items.product");
                return res.status(200).json({message : "Add to cart successful", cart : cart.items});
            }
            const productIndex = cart.items.findIndex(item => item.product.toString() === productId.toString());
            if(productIndex > -1){
                cart.items[productIndex].quantity += quantity;
            }else{
                cart.items.push({
                    product : productId,
                    quantity
                })
            }
            let total = 0;
            for(let item of cart.items) {
                const product = await Product.findById(item.product);
                total += product.price * item.quantity;
                }
            cart.totalPrice = total;
            await cart.save();
            cart = await Cart.findOne({user : user._id}).populate("items.product");
            res.status(200).json({message : "Add to cart successful", cart : cart.items, totalPrice : cart.totalPrice});
        }catch(err){
            return res.status(401).json({message : "Add to cart error"});
        }
})

app.post("/increaseproduct", async(req, res) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message : "Unauthorized"})
    }
    try{
        const user = await jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
        let cart = await Cart.findOne({user : user._id});
        const {productId} = req.body;
        if(!cart){
            return res.status(401).json({err : "Increse product error1"});
        }
        const productIndex = cart.items.findIndex(item => item._id.toString() === productId.toString());
        if(productIndex < 0){
            return res.status(401).json({err : "Increse product error2"});
        }
        cart.items[productIndex].quantity += 1;
        let total = 0;
        console.log(cart.items);
        for(let item of cart.items) {
            const product = await Product.findById(item.product);
            total += product.price * item.quantity;
        }
        cart.totalPrice = total;
        await cart.save();
        cart = await Cart.findOne({user : user._id}).populate("items.product");
        res.status(200).json({message : "Increase product successful", cart : cart.items, totalPrice : cart.totalPrice});
    }catch(err){
        console.log("Increase product error3", err);
    }
})

app.post("/decreaseproduct", async(req, res) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message : "Unauthorized"})
    }
    try{
        const user = await jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
        let cart = await Cart.findOne({user : user._id});
        const {productId} = req.body;
        if(!cart){
            return res.status(401).json({err : "Decrease product error"});
        }
        const productIndex = cart.items.findIndex(item => item._id.toString() === productId.toString());
        if(cart.items[productIndex].quantity === 1){
            return res.status(401).json({message : "Decrease product error"})
        }
        if(productIndex < 0){
            return res.status(401).json({err : "Decrease product error"});
        }
        cart.items[productIndex].quantity -= 1;
        let total = 0;
        for(let item of cart.items) {
            const product = await Product.findById(item.product);
            total += product.price * item.quantity;
        }
        cart.totalPrice = total;
        await cart.save();
        cart = await Cart.findOne({user : user._id}).populate("items.product");
        res.status(200).json({message : "Decrease product successful", cart : cart.items, totalPrice : cart.totalPrice});
    }catch(err){
        console.log("Increase product error", err);
    }
})

app.listen(process.env.PORT, () => console.log("Server is running..."));