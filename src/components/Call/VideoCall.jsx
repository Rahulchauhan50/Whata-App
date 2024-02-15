import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
const Container = dynamic(()=> import("./Container"),{ssr:false})

function VideoCall({socket}) {
  const {UserInfo, videoCall } = useSelector((state) => state.user);

  useEffect(()=>{
    if(videoCall.type==="out-going"){
      socket.current.emit("outgoing-video-call",{
        to:videoCall.id,
        from:UserInfo,
        callType:videoCall.callType,
        roomId:videoCall.roomId
      })
    }
  },[videoCall])

  return <Container data={videoCall} socket={socket} />
}

export default VideoCall;
