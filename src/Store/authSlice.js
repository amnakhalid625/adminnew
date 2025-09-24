import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    email: "",
    role: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Login success
        login: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
        },

        // Logout
        logout: (state) => {
            state.id = "";
            state.name = "";
            state.email = "";
            state.role = "";
        },
    },
});

export const { logout, login } = authSlice.actions;

export default authSlice.reducer;
