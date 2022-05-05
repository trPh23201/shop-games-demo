import { createSlice } from '@reduxjs/toolkit'

export const reducerShowCart = createSlice({
  name: 'showCart',
  initialState: false,
  reducers: {
    toggleCart: ( state, action) =>{
      return action.payload
    }
  },
})


// Action creators are generated for each case reducer function
export const { toggleCart } = reducerShowCart.actions

export default reducerShowCart.reducer