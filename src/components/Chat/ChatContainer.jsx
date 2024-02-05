import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import { useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(()=>import("./VoiceMessage"),{
  ssr:false
}) 


function ChatContainer() {
  const { Messages } = useSelector((state) => state.user)
  const { CurrentChatUser } = useSelector((state) => state.user)
  const { UserInfo } = useSelector((state) => state.user)


  return <div className="h-auto w-full relative flex-grow overflow-auto ">
    <div className="bg-chat-backgroun bg-fixed w-full opacity- relative left-0 top-0 z-0">
      <div className="lg:mx-10 mx-4 my-6 relative bottom-0 z-40 left-0">
      <div className="flex w-full">
      <div className="flex flex-col justify-end w-full gap-1 overflow-auto md:mb-2 mb-6">
        {
          Messages?.map((msg, index)=>{
            return <div key={index} className={`flex max-w-full ${msg.senderId===CurrentChatUser?.id?"justify-start":"justify-end"}`}>
              {
                msg.type==="text" && (
                  <div className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end lg:max-w-[45%] max-w-[100%] ${msg.senderId===CurrentChatUser?.id?"bg-incoming-background":"bg-outgoing-background"} `} >
                    <p >{msg.message}</p>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 " >
                        {calculateTime(msg.createAt)}
                      </span>
                      <span className="">
                        {msg.senderId === UserInfo.id && <MessageStatus messageStatus={msg.messageStatus} />}
                      </span>
                    </div>
                  </div> 
                )
              }
              {msg.type === "image" && <ImageMessage message={msg} />}
              {msg.type === "audio" && <VoiceMessage message={msg} />}
             
            </div>
          })
        }
      </div>
      </div>  
    </div>
    </div>
  </div>;
}

export default ChatContainer;