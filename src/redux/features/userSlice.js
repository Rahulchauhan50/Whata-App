import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  UserInfo:{
    name:"",
    email:"",
    profileImage:"/default_avatar.png",
    status:"",
    about:"Hi there! i am using whatsApp",
    NewUser:"",
    id:undefined
  },
  ConstactPage:false,
  CurrentChatUser:undefined
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      if(action.payload.name){
        state.UserInfo.name = action.payload.name;
      }
      if(action.payload.email){
        state.UserInfo.email = action.payload.email;
      }
      if(action.payload.profileImage){
        state.UserInfo.profileImage = action.payload.profileImage;
      }
      if(action.payload.status){
        state.UserInfo.status = action.payload.status;
      }
      if(action.payload.about){
        state.UserInfo.about = action.payload.about;
      }
      if(action.payload.NewUser){
        state.UserInfo.NewUser = action.payload.NewUser;
      }
      if(action.payload.id){
        state.UserInfo.id = action.payload.id;
      }
      // console.log(action.payload);
      // state.UserInfo = action.payload; 
      // console.log(state.UserInfo);
      // console.log(action.payload)
    },
    setConstactPage:(state, action) => {
      state.ConstactPage = !state.ConstactPage;
    },
    setCurrentChatUser:(state, action)=>{
      state.CurrentChatUser = action.payload.data;
    }
  },
});



export const {setUserInfo, setConstactPage, setCurrentChatUser} = UserSlice.actions;

export default UserSlice.reducer;
