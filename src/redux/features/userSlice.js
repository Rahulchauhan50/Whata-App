import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo:{},
  newUser:false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
      
    },
    setIsNewUser: (state, action) => {
      state.newUser = action.payload
    },
  },
});

export const {setUserInfo , setIsNewUser} = userSlice.actions;

export default userSlice.reducer;
