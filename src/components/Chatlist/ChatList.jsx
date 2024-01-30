import React from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserInfo } from '@/redux/features/userSlice';
import { setConstactPage } from '@/redux/features/userSlice';
import { useEffect } from 'react';
import ContactsList from "./ContactsList";

function ChatList() {
  const { ConstactPage, CurrentChatUser } = useSelector((state) => state.user);



  useEffect(()=>{

  },[ConstactPage])


  return <div className={`${CurrentChatUser?"hidden md:flex":"flex" } bg-panel-header-background flex-col max-h-screen z-20`}>
    {!ConstactPage ?(<><ChatListHeader/><SearchBar/><List/></>):<ContactsList/>}
    
     
  </div>;
}

export default ChatList;
