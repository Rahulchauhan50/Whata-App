import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { EndCall } from "@/redux/features/userSlice";
import { AiFillSound } from "react-icons/ai";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsFillMicMuteFill } from "react-icons/bs";
import axios from "axios";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import { revalidatePath } from "next/cache";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import VoiceCall from "./VoiceCall";

function Container({ socket, data }) {
  const { UserInfo, videoCall, voiceCall } = useSelector((state) => state.user);
  const [acceptCall, setacceptCall] = useState(false)
  const [zcInstance, setZcInstance] = useState(null)
  const [token, settoken] = useState(undefined)
  const [zgVar, setZgVar] = useState(undefined)
  const [localStream, setlocalStream] = useState(undefined)
  const [publicStream, setpublicStream] = useState(undefined)
  const dispatch = useDispatch();

  const endCall = () => {
    const id = data.id
    setacceptCall(false)
    if(data.callType==="voice"){
          socket.current.emit("reject-voice-call",{
            from:id
          });
        }else{
          socket.current.emit("reject-video-call",{
            from:id
          });
        }
        dispatch(EndCall())
  }

  // const endCall = () => {
  //   const id = data.id
  //   if(zgVar && localStream && publicStream){
  //     zgVar.destroyStream(localStream)
  //     zgVar.stopPublishingStream(publicStream)
  //     zgVar.logoutRoom(data.roomId.toString())
  //   }
  //   if(data.callType==="voice"){
  //     socket.current.emit("reject-voice-call",{
  //       from:id
  //     });
  //   }else{
  //     socket.current.emit("reject-video-call",{
  //       from:id
  //     });
  //   }
  //   dispatch(EndCall())
  // }
  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on("accept-call", () => setacceptCall(true))
    }
  }, [data])

  // useEffect(()=>{
  //   const grtToken = async () => {
  //     try {
  //       const {data:{token:returnedToken}} = await axios.get(`${GET_CALL_TOKEN}/${UserInfo.id}`)
  //       settoken(returnedToken)
  //     } catch (err) {
  //       console.log(err)

  //     }
  //   }
  //   if(acceptCall){
  //     grtToken( )
  //   }

  // },[acceptCall])

  // useEffect(()=>{
  //   const startCall = async () => {
  //     import("zego-express-engine-webrtc").then(async({ZegoExpressEngine})=>{
  //       const zg = new ZegoExpressEngine(parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID),process.env.NEXT_PUBLIC_ZEGO_SERVER_ID)
  //       setZgVar(zg)
  //       zg.on("roomStreamUpdate", async(roomID, updateType, streamList, extendedData)=>{
  //         if(updateType==="ADD"){
  //           const rmVideo = document.getElementById("remote-video")
  //           const vd = document.createElement(data.callType==="video"?"video":"audio")
  //           vd.id = streamList[0].streamID;
  //           vd.autoplay=true
  //           vd.playsInline = true;
  //           vd.muted = false;
  //           if(rmVideo){
  //             rmVideo.appendChild(vd)
  //           }
  //           zg.startPlayingStream(streamList[0].streamID,{
  //             audio:true,
  //             video:true
  //           }).then((stream)=>vd.srcObject = stream)

  //         }else if(updateType==="DELETE" && zg && localStream && streamList[0].streamID){
  //           zg.destroyStream(localStream);
  //           zg.stopPublishingStream(streamList[0].streamID)
  //           zg.logoutRoom(data.roomId.toString())
  //           dispatch(EndCall()) 

  //         }

  //       })
  //       await zg.loginRoom(data.roomId.toString(),token,{userID:UserInfo.id, userName:UserInfo.name},{userUpdate:true})
  //       const localStream = await zg.createStream({
  //         camera:{
  //           audio:true,
  //           video:data.callType==="video"?true:false 
  //         }
  //       });
  //       const localVideo = document.getElementById("local-audio");
  //       const videoElement = document.createElement(data.callType==="video"?"video":"audio")
  //       videoElement.id = "video-local-zego"
  //       videoElement.className = "h-28 w-32"
  //       videoElement.autoplay = true
  //       videoElement.muted = false
  //       videoElement.playsInline = true
  //       localVideo.appendChild(videoElement);
  //       const td = document.getElementById("video-local-zego")
  //       td.srcObject = localStream
  //       const streamID = "123"+Date.now()
  //       setpublicStream(streamID);
  //       setlocalStream(localStream)
  //       zg.startPublishingStream(streamID, localStream)
  //     })

  //   }
  //   if(token){
  //     startCall();
  //   }
  // },[token])

  const Mymeetings = (element) => {
    const appId = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
    const serversecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_ID

   if(videoCall || voiceCall){
    const RoomId = data.roomId.toString()
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serversecret, RoomId, Date.now().toString(), UserInfo.name)
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    setZcInstance(zc)
    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall
      },
      maxUsers: 2,
      showRoomTimer: true,
      showPreJoinView: false,
      showUserList: false,
      showScreenSharingButton: true,
      showPreJoinView: false,
      showUserList: false,
      showLeaveRoomConfirmDialog: false,
      showRemoveUserButton: false,
      lowerLeftNotification: {
        showUserJoinAndLeave: false,
        showTextChat: false,
      },
      showRoomDetailsButton: false,
      autoHideFooter: true,
      onLeaveRoom: () => {
        dispatch(EndCall())
      },
      onUserLeave:()=>{
        zc.hangUp()
        dispatch(EndCall())
      },
      showTextChat: false,
      turnOnCameraWhenJoining: data.callType === "voice" ? false : true,
      showMyCameraToggleButton: data.callType === "voice" ? false : true,
      showAudioVideoSettingsButton: data.callType === "voice" ? false : true,
      showScreenSharingButton: data.callType === "voice" ? false : true
    })
   }

  }

  return <div className="border-conversation-border  border-1 w-full bg-conversation-panel-background flex flex-col h-screen overflow-hidden items-center text-white">
    {
      console.log(voiceCall)
    }

   {
    (videoCall !== undefined || voiceCall !== undefined) &&  <div className="h-screen w-screen" ref={Mymeetings} ></div>
   }

    
  </div>;
}

export default Container;
