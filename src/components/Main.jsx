import React from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";

function Main() {
  return <>
  <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
    <ChatList/>
    {/* <Empty/> */}
    <Chat/>
    </div>
  </>;
}

export default Main;
