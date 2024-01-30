import React from "react";
import Avatar from "../common/Avatar";
import {MdCall} from 'react-icons/md'
import {IoVideocam} from 'react-icons/io5'
import {BiSearchAlt2} from "react-icons/bi"
import {BsThreeDotsVertical} from 'react-icons/bs'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setVoiceCall, setVideoCall, setCurrentChatUser } from '@/redux/features/userSlice';
import { setMessageSearch } from "@/redux/features/userSlice";
import { BsArrowLeftShort } from "react-icons/bs"

function ChatHeader() {
  const { UserInfo} = useSelector((state) => state.user)
  const { CurrentChatUser } = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const HandleVoiceCall = () => {
    dispatch(setVoiceCall({voiceCall:{...CurrentChatUser, type:"out-going", callType:"voice", roomId:Date.now()}}))
  }
  const HandleVideoCall = () => {
    dispatch(setVideoCall({videoCall:{...CurrentChatUser, type:"out-going", callType:"video", roomId:Date.now()}}))
  }
  
  return <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10 sticky" >
    <div className="flex items-center justify-center gap-2" >
    <BsArrowLeftShort className="lg:hidden" color="white" size={30} onClick={()=>{dispatch(setCurrentChatUser({data:undefined}))}} />
      <Avatar type='sm' image={CurrentChatUser?.profileImage} />
      <div className="flex flex-col">
        <span className="text-primary-strong" >{CurrentChatUser?.name}</span>
        <span className="text-secondary text-sm" >Offline/online</span>
      </div>
    </div>
    <div className="flex gap-6" >
        <MdCall onClick={HandleVoiceCall} className="text-panel-header-icon cursor-pointer text-xl"/>
        <IoVideocam onClick={HandleVideoCall} className="text-panel-header-icon cursor-pointer text-xl"/>
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" onClick={()=>dispatch(setMessageSearch())}/>
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl"/>
    </div>
  </div>;
}

export default ChatHeader;