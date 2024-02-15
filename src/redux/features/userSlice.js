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
  incomingVoiceCall:undefined,
  Read:false,
  IsfetchingUser:true

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
      // else{
      //   state.UserInfo = {
      //     name:"",
      //     email:"",
      //     profileImage:"/default_avatar.png",
      //     status:"",
      //     about:"Hi there! i am using whatsApp",
      //     NewUser:"",
      //     id:undefined,
      //   }
      // }
    },
    setConstactPage:(state, action) => {
      state.ConstactPage = !state.ConstactPage;
    },
    setCurrentChatUser:(state, action)=>{
      state.CurrentChatUser = action.payload.data;
    },
    setMessages:(state, action) => {
      state.Messages = action.payload.data.message;
    },
    setSocket:(state, action) => {
      state.socket = action.payload;
    },
    setAddMessages:(state, action) => {
      if(state.CurrentChatUser){
        state.Messages = [...state.Messages, action.payload];
      }
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
    },
    setRead:(state, action) => {
      state.Read = action.payload;
      var rrrr = JSON.parse(JSON.stringify(state.Messages))
      var arr = []
      rrrr.map((msg)=>{
       if(msg.messageStatus !== "read"){
        arr = [...arr, {createdAt:msg.createdAt,
          id:msg.id,message:msg.message,
          messageStatus:"read",
          recieverId:msg.recieverId,
          senderId:msg.senderId,
          type:msg.type}]
       }else{
        arr = [...arr,msg]
       }
      })
      state.Messages = [...arr];
    },
    setIsfetchingUser:(state, action) => {
      state.IsfetchingUser = action.payload;
    }
  },
});



export const {setUserInfo, setConstactPage, setCurrentChatUser, setMessages, setSocket, setAddMessages, setMessageSearch, setUserContacts, setOnlineUser, setfilteredContacts, setVideoCall, setVoiceCall, setIncomingVideoCall, setIncomingVoiceCall, EndCall, setRead, setIsfetchingUser} = UserSlice.actions;

export default UserSlice.reducer;
