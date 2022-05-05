import { createSlice } from '@reduxjs/toolkit'
import { getCookie } from '../const/cookie'

export const reducerPurchased = createSlice({
  name: 'Purchased',
  initialState: [],
  reducers: {
    setPurchased: ( state, action) =>{
      return action.payload
    }
  },
})


// Action creators are generated for each case reducer function
export const { getPurchased } = reducerPurchased.actions

export default reducerPurchased.reducer