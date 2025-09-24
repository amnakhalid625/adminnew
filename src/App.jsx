import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layouts/Layout";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";

import Categories from "./Pages/Categories";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import EditOrder from "./Pages/EditOrder";
import OrderDetails from "./Pages/OrderDetails";

import HomeSlides from "./Pages/HomeSlides";
import AddCategory from "./Pages/AddCategory";
import EditCategory from "./Pages/EditCategory";
import AddHomeSlide from "./Pages/AddHomeSlide";
import EditHomeSlide from "./Pages/EditHomeSlide";
import LoginPage from "./Pages/Login";
import AdminProtected from "./components/AdminProtected";
import SignUp from "./Pages/SignUp";
import ProductDetail from "./Pages/ProductDetail";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<AdminProtected />}>
                    <Route
                        index
                        element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route
                        path="products/view/:id"
                        element={<ProductDetail />}
                    />
                    <Route path="products/edit/:id" element={<EditProduct />} />

                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/add" element={<AddCategory />} />
                    <Route path="categories/edit/:id" element={<EditCategory />} />
                    
                    <Route path="users" element={<Users />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/edit/:id" element={<EditOrder />} />    
                    <Route path="orders/view/:id" element={<OrderDetails />} />

                    <Route path="home-slides" element={<HomeSlides />} />
                    <Route path="home-slides/add" element={<AddHomeSlide />} />
                    <Route path="home-slides/edit/:id" element={<EditHomeSlide />} />
                </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;
