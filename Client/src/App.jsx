import {BrowserRouter, Routes, Route} from "react-router-dom";
import { useSelector } from "react-redux";

import useAuthentication from "./hooks/authentication";

import Navbar from "./component/navbar";
import Home from "./pages/home";
import AdminManagement from "./pages/adminManagement";
import UserDashboard from "./pages/ีuserDashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Cart from "./pages/cart";
import ProductDetail from "./pages/productDetail";
import "./styles/App.css";

function App() {

  useAuthentication();

  const {role, isLogin} = useSelector(state => state.user);

  const routeToAdmin = () => {
    if(!isLogin) return <Login/>
    return role === "admin"? <AdminManagement/> : <UserDashboard/>
  }

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/product/:productID" element={<ProductDetail/>}/>
        <Route path="/adminManagement" element={routeToAdmin()}/>
        <Route path="/userDashboard" element={isLogin? <UserDashboard/> : <Login/>}/>
        <Route path="/login" element={!isLogin? <Login/> : <Home/>}/>
        <Route path="/cart" element={isLogin? <Cart/> : <Home/>}/>
        <Route path="/register" element={!isLogin? <Register/> : <Home/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
