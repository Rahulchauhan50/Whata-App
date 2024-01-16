import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from 'react-icons/im'
import { MdSend } from "react-icons/md";
import { useSelector } from "react-redux";

function MessageBar() {
  const [Message, setMessage] = useState('');
  const { UserInfo } = useSelector((state) => state.user)
  const { CurrentChatUser } = useSelector((state) => state.user)

  const sendMessage = async(e) => {
    e.preventDefault();
    console.log(UserInfo)
    console.log(CurrentChatUser)
    try {
      const {data} = await axios.post(ADD_MESSAGE_ROUTE,{
        to:CurrentChatUser?.id,
        from:UserInfo?.id,
        message:Message
      })
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile className="cursor-pointer text-panel-header-icon text-xl" title="Emoji" />
          <ImAttachment className="cursor-pointer text-panel-header-icon text-xl" title="Attachment" />
        </div>
        <form onSubmit={sendMessage} className="w-full rounded-lg h-10 flex items-center">
          <input
            value={Message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
          />
        </form>
        <div className="flex w-10 items-center justify-center">
          <button type="submit">
            <MdSend onClick={sendMessage} className="text-panel-header-icon cursor-pointer text-xl" title="Send Message" />
          </button>
        </div>
      </>
    </div>
  );
}

export default MessageBar;
