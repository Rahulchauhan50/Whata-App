import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { EndCall} from "@/redux/features/userSlice";
import axios from "axios";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import { revalidatePath } from "next/cache";

function Container({socket,data}) {
  const { UserInfo} = useSelector((state) => state.user);
  const [acceptCall, setacceptCall] = useState(false)
  const [token, settoken] = useState(undefined)
  const [zgVar, setZgVar] = useState(undefined)
  const [localStream, setlocalStream] = useState(undefined)
  const [publicStream, setpublicStream] = useState(undefined)
  const dispatch = useDispatch();

  const endCall = () => {
    const id = data.id
    if(data.callType==="voice"){
      socket.current.emit("reject-voice-call",{
        from:id
      });
      if(zgVar && localStream && publicStream){
        zgVar.destroyStream(localStream)
        zgVar.stopPublishingStream(publicStream)
        zgVar.logoutRoom(data.roomId.toString())
      }
    }else{
      socket.current.emit("reject-video-call",{
        from:id
      });
    }
    dispatch(EndCall())
  }

  useEffect(()=>{
    if(data.type==="out=going"){
      socket.current.on("accept-call", ()=> setacceptCall(true))
    }
    // else{
    //   setTimeout(() => {
    //     setacceptCall(true)
    //   }, 1000);
    // }
  },[data])

  useEffect(()=>{
    const grtToken = async () => {
      try {
        const {data:{token:returnedToken}} = await axios.get(`${GET_CALL_TOKEN}/${UserInfo.id}`)
        settoken(returnedToken)
      } catch (err) {
        console.log(err)
        
      }
    }
    grtToken( )
  },[acceptCall])

  useEffect(()=>{
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(async({ZegoExpressEngine})=>{
        const zg = new ZegoExpressEngine(parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID),process.env.NEXT_PUBLIC_ZEGO_SERVER_ID)
        setZgVar(zg)
        zg.on("roomStreamUpdate", async(room, updateType, streamList, extendedData)=>{
          if(updateType==="ADD"){
            const rmVideo = document.getElementById("remote-video")
            const vd = document.createElement(data.callType==="video"?"video":"audio")
            vd.id = streamList[0].streamID;
            vd.autoplay=true
            vd.playInline = true;
            vd.muted = false;
            if(rmVideo){
              rmVideo.appendChild(vd)
            }
            zg.startPlayingStream(streamList[0].streamID,{
              audio:true,
              video:true
            }).then((stream)=>vd.srcObject = stream)

          }else if(updateType==="DELETE" && zg && localStream && streamList[0].streamID){
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID)
            zg.logoutRoom(data.roomId.toString())
            dispatch(EndCall()) 

          }

        })
        const result  = await zg.loginRoom(data.roomId.toString(),token,{userID:UserInfo.id, userName:UserInfo.name},{userUpdate:true})
        console.log(result)
        const localStream = await zg.createStream({
          camera:{
            audio:true,
            video:data.callType==="video"?true:false 
          }
        });
        const localVideo = document.getElementById("local-audio");
        console.log(data)
        const videoElement = document.createElement(data.callType==="video"?"video":"audio")
        videoElement.id = "video-local-zego"
        videoElement.className = "h-28 w-32"
        videoElement.autoplay = true
        videoElement.muted = false
        videoElement.playsInline = true
        localVideo.appendChild(videoElement);
        const td = document.getElementById("video-local-zego")
        td.srcObject = localStream
        const streamID = "123"+Date.now()
        setpublicStream(streamID);
        setlocalStream(localStream)
        zg.startPublishingStream(streamID, localStream)
      })

    }
    if(token){
      startCall()
    }
  },[token])

  return <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-screen overflow-hidden items-center justify-center text-white">
    <div className="flex flex-col gap-3 items-center">
      <span className="text-5xl">{data.name}</span>
      <span>
        {
          acceptCall && data.callType !== "video"?"Out going call":"Calling"
        }
      </span>

    </div>
    {
      (!acceptCall || data.callType === "voice") && <div className="my-24">
          <Image src={data.profileImage} alt="avatar" height={300} width={300} className="rounded-full" />
      </div>
    }
    <div className="my-5 relative " id="remote-video" >
      <div className="absolute bottom-5 right-5" id="local-audio" >

      </div>
    </div>
    <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
      <MdOutlineCallEnd onClick={endCall} className="text-3xl cursor-pointer"/>
    </div>
    
  </div>;
}

export default Container;
