import React, { useEffect, useRef } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import { useSelector } from "react-redux";
import axios from "axios";
import { GET_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { setMessages } from '@/redux/features/userSlice';
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSocket , setAddMessages} from '@/redux/features/userSlice';
import { useState } from "react";

function Main() {
  const { CurrentChatUser } = useSelector((state) => state.user);
  const { UserInfo } = useSelector((state) => state.user);
  const [socketEvent, setsocketEvent] = useState(false)
  const dispatch = useDispatch();
  const socket = useRef();

  useEffect(()=>{
    if(UserInfo?.id){
      socket.current = io(HOST);
      console.log(socket)
      socket.current.on('connect', () => {
        dispatch(setSocket({ socketId: socket.current.id}));
      });
      socket.current.emit("add-user",UserInfo?.id);
      // dispatch(setSocket({socketId: socket.current.id }));
    }
  },[UserInfo?.id])

  

  useEffect(()=>{
    // if(socket.current){
      socket?.current?.on("msg-recieve",(data)=>{
        dispatch(setAddMessages(data))
      })
    //   setsocketEvent(true);
    // }
  },[socket?.current])

  useEffect(()=>{
    const getMessages = async () => {
      const {data} = await axios.get(`${GET_MESSAGE_ROUTE}/${UserInfo.id}/${CurrentChatUser.id}`)
      // console.log({data})
      dispatch(setMessages({data}))
    }

    if(UserInfo?.id && CurrentChatUser?.id){
      getMessages();
    }
  },[CurrentChatUser])
  return <>
  <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
    <ChatList/>
    {CurrentChatUser?<Chat socket={socket}/>:""}
    
    </div>
  </>;
}

export default Main;
