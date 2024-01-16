import React from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import { useSelector } from "react-redux";

function Main() {
  const { CurrentChatUser } = useSelector((state) => state.user)
  return <>
  <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
    <ChatList/>
    {CurrentChatUser?<Chat/>:<Empty/>}
    
    </div>
  </>;
}

export default Main;
