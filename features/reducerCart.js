import { createSlice } from '@reduxjs/toolkit'
function findIndex(state,id){
    var temp=-1;
    state.forEach((st,index)=>{
        if (st.id === id) temp = index;
    })
    return temp
}

const cart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("cart")) : null

export const reducerCart = createSlice({
    name: 'cart',
    initialState: cart ? cart : [],
    reducers: {
        addProduct: (state, action) => {
            var index = findIndex(state,action.payload.id)
            if (index === -1){
                state.push(action.payload);
                localStorage.setItem("cart", JSON.stringify(state))
            }           
        },
        remove: (state, action) => {
            var index = findIndex(state,action.payload)
            if (index !== -1){
                state.splice(index,1)
                localStorage.setItem("cart", JSON.stringify(state))
            } 
        },
        removeAll: (state) => {
            state.length = 0
            localStorage.setItem("cart", JSON.stringify(state))
        }
    }
})


// Action creators are generated for each case reducer function
export const { addProduct,remove,removeAll } = reducerCart.actions

export default reducerCart.reducer