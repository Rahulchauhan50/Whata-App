import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserContacts, setOnlineUser } from '@/redux/features/userSlice';
import { GET_INITIAL_CONTACT_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatList from "./ChatList";
import ChatLIstItem from "./ChatLIstItem";
import { data } from "autoprefixer";

function List() {
  const { UserInfo } = useSelector((state) => state.user)
  const { filteredContacts } = useSelector((state) => state.user)
  const { UserContacts } = useSelector((state) => state.user)
  const dispatch = useDispatch();

  useEffect(()=>{
    const getContacts = async () =>{
      try {
        const {data:{users,onlineUsers}} = await axios.get(`${GET_INITIAL_CONTACT_ROUTE}/${UserInfo?.id}`)
        dispatch(setOnlineUser({onlineUsers}));
        dispatch(setUserContacts({userContacts:users}));
      } catch (error) {
        console.log(error)
      }
    }
    if(UserInfo.id){
      getContacts()
    }
  },[UserInfo?.id])

  return <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full " >
    {
      filteredContacts && filteredContacts.length>0?filteredContacts?.map((contacts)=>{
        return <ChatLIstItem data={contacts.id===contacts.lastMessage.senderId?contacts.lastMessage.sender:contacts.lastMessage.reciever} key={contacts?.id} unreadMessageCount={contacts?.unreadMessageCount} lastMessage={contacts?.lastMessage}/>
    
      }):UserContacts?.map((contacts)=>{
        return <ChatLIstItem data={contacts.id===contacts.lastMessage.senderId?contacts.lastMessage.sender:contacts.lastMessage.reciever} key={contacts?.id} unreadMessageCount={contacts?.unreadMessageCount} lastMessage={contacts?.lastMessage}/>
    
      })
    }
  </div>
}

export default List;
