import React, { useEffect, useRef } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import { useSelector } from "react-redux";
import axios from "axios";
import { GET_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { setMessages } from "@/redux/features/userSlice";
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
    CurrentChatUser,
    videoCall,
    voiceCall,
    incomingVideoCall,
    incomingVoiceCall,
  } = useSelector((state) => state.user);
  const [socketEvent, setsocketEvent] = useState(false);
  const dispatch = useDispatch();
  const socket = useRef();

  useEffect(() => {
    if (UserInfo?.id) {
      socket.current = io(HOST);
      socket.current.on("connect", () => {
        dispatch(setSocket({ socketId: socket.current.id }));
      });
      socket.current.emit("add-user", UserInfo?.id);
      // dispatch(setSocket({socketId: socket.current.id }));
    }
  }, [UserInfo?.id]);

  useEffect(() => {
    if(socket.current){
      alert("socket")
    socket?.current?.on("msg-recieve", (data) => {
      dispatch(setAddMessages(data));
    });

    socket?.current?.on("incoming-voice-call", ({from,roomId,callType}) => {
      dispatch(setIncomingVoiceCall({incomingVoiceCall:{...from,roomId,callType}}));
      // console.log(incomingVoiceCall)
    });

    socket?.current?.on("incoming-video-call", ({from,roomId,callType}) => {
      alert("incoming video call")
      dispatch(setIncomingVideoCall({incomingVideoCall:{...from,roomId,callType}}));
    });

    socket?.current?.on("voice-call-rejected", () => {
      dispatch(EndCall())
    });

    socket?.current?.on("video-call-rejected", () => {
      dispatch(EndCall())
    });
      // setsocketEvent(true); 
    }
  }, [socket?.current]);

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(
        `${GET_MESSAGE_ROUTE}/${UserInfo.id}/${CurrentChatUser.id}`
      );
      // console.log({data})
      dispatch(setMessages({ data }));
    };

    if (UserInfo?.id && CurrentChatUser?.id) {
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
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {CurrentChatUser ? (
            <div
              className={`${
                MessageSearch ? "grid grid-cols-2" : "grid-cols-2"
              } h-screen`}
            >
              <Chat socket={socket} />
              {MessageSearch && <SearchMessages />}
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
