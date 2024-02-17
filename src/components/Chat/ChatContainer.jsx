import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
import { setMessages, setRead } from "@/redux/features/userSlice";
const VoiceMessage = dynamic(()=>import("./VoiceMessage"),{
  ssr:false
}) 


function ChatContainer({socket}) {
  const { Messages,CurrentChatUser,UserInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const getTime = (date) => {
    const dateObject = new Date(date);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = dateObject.toLocaleString('en-US', options);
    return formattedTime.toString()
  }

  
  
  useEffect(()=>{
    socket?.current?.on("msg-read", () => {
      dispatch(setRead(true))
    });  
    return (()=>{
      // dispatch(setRead(false))
    })
  },[Messages])


  return <div className="relative flex-grow overflow-auto custom-scrollbar-width-0">
  <div
    className="bg-chat-background opacity-5 w-full fixed top-0 right-0 bottom-0 left-0 z-0"
  ></div>

  {/* Your existing content */}
  <div className="bg-fixed w-full relative left-0 top-0 z-0">
    <div className="lg:mx-10 mx-4 my-6 relative bottom-0 z-40 left-0">
      <div className="flex w-full">
        <div className="flex flex-col justify-end w-full gap-2 md:mb-2 mb-24">
          {
            Object.entries(Messages).map(([date, messageList])=>{
              return (
                <div key={date} className="flex flex-col justify-end w-full gap-2 md:mb-2 mb-4" >
                <div className="text-secondary flex justify-center pl-10 py-5">
                  <span className="text-[0.700rem] bg-incoming-background bottom-1 rounded-sm p-2" >{date}</span>
                </div>
                {messageList?.map((msg, index ) => (
            <div key={index} className={`flex max-w-full ${msg.senderId === CurrentChatUser?.id ? "justify-start left" : "justify-end right"}`}>
              {msg.type === "text" && (
                <div className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[90%] ${msg.senderId === CurrentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
                  <p>{msg.message}</p>
                  <div className="flex gap-1 items-end">
                    <span className="text-bubble-meta truncate text-[11px] pt-1">{getTime(msg.createdAt)}</span>
                    <span>{msg.senderId === UserInfo.id && <MessageStatus messageStatus={msg.messageStatus} />}</span>
                  </div>
                </div>
              )}
              {msg.type === "image" && <ImageMessage message={msg} />}
              {msg.type === "audio" && <VoiceMessage message={msg} />}
            </div>
          ))}
              </div>
              )
            })
          }
        
         
        </div>
      </div>
    </div>
  </div>
</div>


}

export default ChatContainer;


