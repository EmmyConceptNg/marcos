import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    
    details: null,
  },
  reducers: {
    setUser: (state, action) => {
    
      state.details = action.payload; 
    },
    clearUser: (state) => {
      
      state.details = null;
    },
    // You can add more reducers here
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
