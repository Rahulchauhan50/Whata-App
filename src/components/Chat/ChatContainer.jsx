import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import { useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

function ChatContainer() {
  const { Messages } = useSelector((state) => state.user)
  const { CurrentChatUser } = useSelector((state) => state.user)
  const { UserInfo } = useSelector((state) => state.user)


  return <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar-width-0">
    <div className="bg-chat-background-ghfghfghfghfghfghfghfghfghfghfghfgh bg-fixed h-full w-full opacity- relative left-0 top-0 z-0">
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
      <div className="flex w-full">
        {console.log(Messages)}
      <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
        {
          Messages?.map((msg, index)=>{
            return <div key={index} className={`flex max-w-full ${msg.senderId===CurrentChatUser?.id?"justify-start":"justify-end"}`}>
              {
                msg.type==="text" && (
                  <div className={`text-white px-2 py-[5px] tex-sm rounded-md flex gap-2 items-end max-w-[45%] ${msg.senderId===CurrentChatUser?.id?"bg-incoming-background":"bg-outgoing-background"} `} >
                    <p >{msg.message}</p>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit" >
                        {calculateTime(msg.createAt)}
                      </span>
                      <span>
                        {console.log(msg)}
                        {msg.senderId === UserInfo.id && <MessageStatus messageStatus={msg.messageStatus} />}
                      </span>
                    </div>
                  </div> 
                )
              }
              {
                msg.type === "image" && <ImageMessage message={msg} />
              }
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
