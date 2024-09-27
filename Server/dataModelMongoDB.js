require("dotenv").config();
const mongoose = require("mongoose");
const dbUrl = process.env.DATABASE_URL;

const connectDB = async() => {
    if(!dbUrl){
        console.log("DATABASE_URL is not defined in .env file");
        return;
    }
    try{
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB");
    }catch(err){
        console.log("Connected to MongoDB error", err);
    }
}

connectDB();

const userSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true},
    email : {type : String, required : false, default : null},
    password : {type : String, required : true},
    address : {type : String, required : false, default : null},
    role : {type : String, enum : ["customer", "admin"], default : "customer"}
}, {timestamps : true});

const productSchema = new mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String, required : false, default : null},
    price : {type : Number, required : true},
    stock : {type : Number, required : true},
}, {timestamps : true});

const cartSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    items : [
        {
            product : {type : mongoose.Schema.Types.ObjectId, ref : "Product", required : true},
            quantity : {type : Number, required : true, min : 1}    
        }
    ],
    totalPrice : {type : Number, required : true}
}, {timestamps : true});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Cart = mongoose.model("Cart", cartSchema);

module.exports = {User, Product, Cart};