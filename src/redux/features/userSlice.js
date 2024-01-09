import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  UserInfo:{},
  NewUser:false
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      console.log(action.payload);
      state.UserInfo = action.payload; // Update state.UserInfo
      console.log(state.UserInfo); // Access state.UserInfo
    },
    setIsNewUser: (state, action) => {
      state.NewUser = action.payload;
    },
  },
});



export const {setUserInfo , setIsNewUser} = UserSlice.actions;

export default UserSlice.reducer;
