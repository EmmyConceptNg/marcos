import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    details: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.details = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.details = null;
    },
    // You can add more reducers here
  },
});

export const { setUser, clearUser, setToken } = userSlice.actions;

export default userSlice.reducer;
