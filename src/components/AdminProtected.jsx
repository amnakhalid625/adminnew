import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtected = () => {
    const user = useSelector((state) => state.auth);

    return user.id !== "" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtected;
