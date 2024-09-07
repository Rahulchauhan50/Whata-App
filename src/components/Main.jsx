import React, { useEffect, useRef } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import { useSelector } from "react-redux";
import axios from "axios";
import { GET_INITIAL_CONTACT_ROUTE, GET_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { setMessages, setOnlineUser, setUserContacts } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {EndCall, setSocket, setAddMessages, setIncomingVoiceCall, setIncomingVideoCall } from "@/redux/features/userSlice";
import { useState } from "react";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const {
    MessageSearch,
    UserInfo,
    videoCall,
    voiceCall,
    incomingVideoCall,
    incomingVoiceCall,
    Messages
  } = useSelector((state) => state.user);
  const {CurrentChatUser} = useSelector((state)=>state.user)
  const [socketEvent, setsocketEvent] = useState(false);
  const dispatch = useDispatch();
  const socket = useRef();

  useEffect(() => {
    if (UserInfo?.id) {
      socket.current = io(HOST);
      
      // Listen for socket connection
      socket.current.on("connect", () => {
        dispatch(setSocket({ socketId: socket.current.id }));

      });
  
      // Add user on connect
      socket.current.emit("add-user", UserInfo?.id);
  
      // Listen for socket disconnection
      socket.current.on("disconnect", () => {
       
      });
  
      // Cleanup on component unmount
      return () => {
        socket.current.disconnect();
      };
    }
  }, [UserInfo?.id]);

  const getContacts = async () =>{

    try {
      const {data:{users,onlineUsers}} = await axios.get(`${GET_INITIAL_CONTACT_ROUTE}/${UserInfo?.id}`)
      dispatch(setUserContacts({userContacts:users}));
      dispatch(setOnlineUser({onlineUsers}));
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if(socket.current){
    socket?.current?.on("msg-recieve", (data) => {
  
      if(CurrentChatUser !== undefined && CurrentChatUser.id === data.senderId){
        dispatch(setAddMessages(data));
      }
      getContacts();
    });
 
    socket?.current?.on("incoming-voice-call", ({from,roomId,callType}) => {
      dispatch(setIncomingVoiceCall({incomingVoiceCall:{...from,roomId,callType}}));
    });

    socket?.current?.on("incoming-video-call", ({from,roomId,callType}) => {
      dispatch(setIncomingVideoCall({incomingVideoCall:{...from,roomId,callType}}));
    });
    socket?.current?.on("voice-call-rejected", () => {
      dispatch(EndCall())
    });
    socket?.current?.on("video-call-rejected", () => {
      dispatch(EndCall())
    });
    socket.current.on("online-users",({onlineUsers})=>{
      dispatch(setOnlineUser({onlineUsers}))
    })
    }

  //   return () => {
  //     socket.current?.disconnect();
  //     socket.current?.off('disconnect');
  //     socket.current?.emit('DisconnectEvent')
  // };
  }, [socket.current,CurrentChatUser]);


  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(
        `${GET_MESSAGE_ROUTE}/${UserInfo.id}/${CurrentChatUser.id}`
      );
      const {data:{users,onlineUsers}} = await axios.get(`${GET_INITIAL_CONTACT_ROUTE}/${UserInfo?.id}`)
      dispatch(setUserContacts({userContacts:users}));
      dispatch(setOnlineUser({onlineUsers}));
      dispatch(setMessages({ data }));
      console.log(data)
    };

    if (UserInfo?.id && CurrentChatUser?.id) {
      // getContacts();
      getMessages();
    }
  }, [CurrentChatUser]);
  return (
    <>
    {
      incomingVideoCall && <IncomingVideoCall socket={socket} />
    }
    {
      incomingVoiceCall && <IncomingCall socket={socket} />
    }
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall socket={socket} />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall socket={socket} />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid md:grid-cols-main h-screen w-screen max-h-screen max-w-full ">
          <ChatList socket={socket} />
          {CurrentChatUser ? (
            <div
            className={`${
              MessageSearch ? "md:grid md:grid-cols-2 md:w-auto w-screen" : "grid-cols-2"
            } h-screen`}
              // className={`grid-cols-2 h-screen `}
            >
              <Chat socket={socket} />
              { <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
