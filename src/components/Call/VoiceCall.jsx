import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
const Container = dynamic(()=> import("./Container"),{ssr:false})

function VoiceCall({socket}) {
  const {UserInfo, voiceCall } = useSelector((state) => state.user);

  useEffect(()=>{
    if(voiceCall.type==="out-going"){
      socket.current.emit("outgoing-voice-call",{
        to:voiceCall.id,
        from:UserInfo,
        callType:voiceCall.callType,
        roomId:voiceCall.roomId
      })
    }
  },[voiceCall])

  return <Container data={voiceCall} socket={socket} />
}

export default VoiceCall;
