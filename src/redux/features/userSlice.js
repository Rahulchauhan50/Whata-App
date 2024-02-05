import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  UserInfo:{
    name:"",
    email:"",
    profileImage:"/default_avatar.png",
    status:"",
    about:"Hi there! i am using whatsApp",
    NewUser:"",
    id:undefined,
  },
  ConstactPage:false,
  CurrentChatUser:undefined,
  Messages:undefined,
  socket:undefined,
  MessageSearch:false,
  UserContacts:[],
  OnlineUser:[],
  filteredContacts:[],
  videoCall:undefined,
  voiceCall:undefined,
  incomingVideoCall:undefined,
  incomingVoiceCall:undefined

};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      if(action.payload?.name){
        state.UserInfo.name = action.payload.name;
      }
      if(action.payload?.email){
        state.UserInfo.email = action.payload.email;
      }
      if(action.payload?.profileImage){
        state.UserInfo.profileImage = action.payload.profileImage;
      }
      if(action.payload?.status){
        state.UserInfo.status = action.payload.status;
      }
      if(action.payload?.about){
        state.UserInfo.about = action.payload.about;
      }
      if(action.payload?.NewUser){
        state.UserInfo.NewUser = action.payload.NewUser;
      }
      if(action.payload?.id){
        state.UserInfo.id = action.payload.id;
      }
      else{
        state.UserInfo = {
          name:"",
          email:"",
          profileImage:"/default_avatar.png",
          status:"",
          about:"Hi there! i am using whatsApp",
          NewUser:"",
          id:undefined,
        }
      }
    },
    setConstactPage:(state, action) => {
      state.ConstactPage = !state.ConstactPage;
    },
    setCurrentChatUser:(state, action)=>{
      state.CurrentChatUser = action.payload.data;
    },
    setMessages:(state, action) => {
      state.Messages = action.payload.data.messages;
    },
    setSocket:(state, action) => {
      state.socket = action.payload;
    },
    setAddMessages:(state, action) => {
      state.Messages = [...state.Messages, action.payload];
    },
    setMessageSearch:(state, action) => {
      state.MessageSearch = !state.MessageSearch
    },
    setUserContacts:(state, action) => {
      state.UserContacts = action.payload.userContacts
    },
    setOnlineUser:(state, action) => {
      state.OnlineUser = action.payload.onlineUsers
    },
    setfilteredContacts: (state, action) => {
      const UserContacts = JSON.parse(JSON.stringify(state.UserContacts));
    
      const filteredContacts = UserContacts.filter((contact) => {
        const contacts = contact.id === contact.lastMessage.senderId
          ? contact.lastMessage.sender
          : contact.lastMessage.reciever;

        return contacts.name.toLowerCase().includes(action.payload.contactSearch.toLowerCase());
      });
    
      state.filteredContacts = filteredContacts;
    },
    setVideoCall:( state ,action) => {
      state.videoCall = action.payload.videoCall
    },
    setVoiceCall:( state ,action) => {
      state.voiceCall = action.payload.voiceCall
    },
    setIncomingVideoCall:( state ,action) => {
      state.incomingVideoCall = action.payload.incomingVideoCall
    },
    setIncomingVoiceCall:( state ,action) => {
      state.incomingVoiceCall = action.payload.incomingVoiceCall
    },
    EndCall:( state ,action) => {
      state.videoCall=undefined
      state.voiceCall=undefined
      state.incomingVideoCall=undefined
      state.incomingVoiceCall=undefined
    }
  },
});



export const {setUserInfo, setConstactPage, setCurrentChatUser, setMessages, setSocket, setAddMessages, setMessageSearch, setUserContacts, setOnlineUser, setfilteredContacts, setVideoCall, setVoiceCall, setIncomingVideoCall, setIncomingVoiceCall, EndCall} = UserSlice.actions;

export default UserSlice.reducer;