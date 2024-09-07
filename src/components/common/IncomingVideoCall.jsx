import { EndCall, setIncomingVideoCall, setVideoCall } from "@/redux/features/userSlice";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function IncomingVideoCall({socket}) {
  const {MessageSearch, UserInfo, CurrentChatUser, videoCall, voiceCall, incomingVideoCall, incomingVoiceCall } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const acceptCall = () => {
    dispatch(setVideoCall({videoCall:{...incomingVideoCall,type:"in-coming"}}))
    socket.current.emit("accept-incoming-call",{id:incomingVideoCall.id})
    dispatch(setIncomingVideoCall({incomingVideoCall:undefined}))
    
  }
  const rejectCall = () => {
    dispatch(EndCall())
    socket.current.emit("reject-video-call",{from:incomingVideoCall.id})
  }

  return <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
    <div>
      <Image src={incomingVideoCall.profileImage} alt="avatar" height={70} width={70} className="rounded-full " />
    </div>
    <div>
      <div>
        {incomingVideoCall.name}
      </div>
      <div className="text-xs">Incoming video call</div>
      <div className="flex gap-2 mt-2" >
        <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>Reject</button>
        <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>Accept</button>
      </div>
    </div>
    
  </div>;
}

export default IncomingVideoCall;
