import React, { useState } from "react";
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
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const { CurrentChatUser, OnlineUser } = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const [contextMenuCordinates, setcontextMenuCordinates] = useState({x:0,y:0})
  const [IsContextMenuVisible, setIsContextMenuVisible] = useState(false)

  const contextMenuOptions = [
    {name:"Exist",callback:() => {
      dispatch(setCurrentChatUser({data:undefined}))
    }}
  ]

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true)
    setcontextMenuCordinates({x:e.pageX,y:e.pageY})

  }

  const HandleVoiceCall = () => {
    dispatch(setVoiceCall({voiceCall:{...CurrentChatUser, type:"out-going", callType:"voice", roomId:Date.now()}}))
  }
  const HandleVideoCall = () => {
    dispatch(setVideoCall({videoCall:{...CurrentChatUser, type:"out-going", callType:"video", roomId:Date.now()}}))
  }
  
  return <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10 " >
    <div className="flex items-center justify-center gap-2" >
    <BsArrowLeftShort className="lg:hidden" color="white" size={30} onClick={()=>{dispatch(setCurrentChatUser({data:undefined}))}} />
      <Avatar type='sm' image={CurrentChatUser?.profileImage} />
      <div className="flex flex-col">
        <span className="text-primary-strong" >{CurrentChatUser?.name}</span>
        <span className="text-secondary text-sm" >
        {
    OnlineUser.includes(CurrentChatUser.id) ? "online" : "offline"
  }
        </span>
      </div>
    </div>
    <div className="flex gap-6" >
        <MdCall onClick={HandleVoiceCall} className="text-panel-header-icon cursor-pointer text-xl"/>
        <IoVideocam onClick={HandleVideoCall} className="text-panel-header-icon cursor-pointer text-xl"/>
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" onClick={()=>dispatch(setMessageSearch())}/>
        <BsThreeDotsVertical onClick={(e)=>showContextMenu(e)} className="text-panel-header-icon cursor-pointer text-xl context-openers"/>
       
        {
          IsContextMenuVisible && (<ContextMenu options={contextMenuOptions} cordinate={contextMenuCordinates} contextMenu={IsContextMenuVisible} setContextMenu={setIsContextMenuVisible} />)
        }
    </div>
  </div>;
}

export default ChatHeader;