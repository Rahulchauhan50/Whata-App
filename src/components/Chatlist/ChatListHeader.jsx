import React from "react";
import Avatar from "../common/Avatar";
import { BsFillChatLeftTextFill, BsThreeDotsVertical} from 'react-icons/bs'
import { useDispatch } from "react-redux";
import { setConstactPage } from '@/redux/features/userSlice';
import { useSelector } from "react-redux";

function ChatListHeader() {
  const dispatch = useDispatch();
  const { UserInfo } = useSelector((state) => state.user)

  return <div className="h-16 px-4 py-3 flex justify-between items-center">
    <div className="cursor-pointer">
      <Avatar type="sm" image={UserInfo?.profileImage}/>
    </div>
    <div className="flex gap-6">
      <BsFillChatLeftTextFill onClick={()=>{dispatch(setConstactPage());}} className="text-panel-header-icon cursor-pointer text-xl" title="New Chat" />
      <>
      <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" />
      </>
    </div>
  </div>;
}

export default ChatListHeader;
