import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserContacts, setOnlineUser } from '@/redux/features/userSlice';
import { GET_INITIAL_CONTACT_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatList from "./ChatList";

function List() {
  const { UserInfo } = useSelector((state) => state.user)
  const { UserContacts } = useSelector((state) => state.user)

  const dispatch = useDispatch();

  useEffect(()=>{
    const getContacts = async () =>{
      try {
        const {data:{users, onlineUsers}} = await axios.get(`${GET_INITIAL_CONTACT_ROUTE}/${UserInfo?.id}`)
        console.log("rajhhj")
        dispatch(setOnlineUser({onlineUsers}));
        dispatch(setUserContacts({userContacts:users}));
        console.log(users)
      } catch (error) {
        console.log(error)
      }
    }
    if(UserInfo.id){
      getContacts()
    }
  },[UserInfo?.id])

  return <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar" >
{
  UserContacts?.map((contacts)=>{
    return <ChatList data={contacts} key={contacts?.id} />

  })
}
  </div>
}

export default List;
