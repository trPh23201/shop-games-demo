import { configureStore } from "@reduxjs/toolkit";
import reducerCart from "../features/reducerCart";
import reducerPurchased from "../features/reducerPurchased";
import reducerShowCart from "../features/reducerShowCart";

export const store = configureStore({
    reducer:{
        cart: reducerCart,
        showCart: reducerShowCart,
        purchased: reducerPurchased
    }
})