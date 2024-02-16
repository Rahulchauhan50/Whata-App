import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { EndCall} from "@/redux/features/userSlice";
import { AiFillSound } from "react-icons/ai";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsFillMicMuteFill } from "react-icons/bs";
import axios from "axios";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import { revalidatePath } from "next/cache";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function Container({socket,data}) {
  const { UserInfo} = useSelector((state) => state.user);
  const [acceptCall, setacceptCall] = useState(false)
  const [token, settoken] = useState(undefined)
  const [zgVar, setZgVar] = useState(undefined)
  const [localStream, setlocalStream] = useState(undefined)
  const [publicStream, setpublicStream] = useState(undefined)
  const dispatch = useDispatch();

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
  // useEffect(()=>{
  //   if(data.type==="out-going"){
  //     socket.current.on("accept-call", ()=> setacceptCall(true))
  //   }
  //   // else{
  //   //   setTimeout(() => {
  //   //     setacceptCall(true)
  //   //   }, 1000);
  //   // }
  // },[data])

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
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serversecret,"ghsdhsdj", Date.now().toString(), "rahul")
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    console.log(zc)
    zc.joinRoom( {
      container:element,
      scenario:{
        mode: ZegoUIKitPrebuilt.OneONoneCall
      },
      showScreenSharingButton:true,
      showPreJoinView:false,
      showLeaveRoomConfirmDialog:false,
 turnOnCameraWhenJoining: data.callType==="voice"?false:true,
 showMyCameraToggleButton: data.callType==="voice"?false:true,
 showAudioVideoSettingsButton: data.callType==="voice"?false:true,
 showScreenSharingButton: data.callType==="voice"?false:true 
    })
  }

  return <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-screen overflow-hidden items-center text-white">
   {/* <div
    className="bg-chat-background opacity-5 w-full fixed top-0 right-0 bottom-0 left-0 z-0"
  ></div>
    {
      (!acceptCall || data.callType === "voice") && <div className="my-8">
          <Image src={data.profileImage} alt="avatar" height={100} width={100} className="rounded-full" />
      </div>
    }
     <div className="flex flex-col gap-3 items-center">
      <span className="md:text-5xl text-2xl">{data.name}</span>
      <span>
        {
          acceptCall && data.callType !== "video"?"Out going call":"Calling"
        }
      </span>

    </div>
    <div className="my-5 relative " id="remote-video" >
      <div className="absolute bottom-5 right-5" id="local-audio" >

      </div>
    </div>
    
    <div style={{bottom:"0vh",justifyContent:"space-around"}} className="bg-panel-header-background w-screen bottom-[0vh] fixed h-20 rounded-tr-2xl rounded-tl-2xl flex flex-row justify-around items-center">
    <div className="h-16 w-16  flex items-center justify-center rounded-full">
      <AiFillSound  onClick={endCall} className="text-3xl cursor-pointer"/>
    </div>
    <div className="h-16 w-16 flex items-center justify-center rounded-full">
      <BsCameraVideoFill onClick={endCall} className="text-2xl text-slate-400 cursor-pointer"/>
    </div>
    <div className="h-16 w-16  flex items-center justify-center rounded-full">
      <BsFillMicMuteFill onClick={endCall} className="text-2xl cursor-pointer"/>
    </div>
    <div className="h-12 w-12 bg-red-600 flex items-center justify-center rounded-full">
      <MdOutlineCallEnd onClick={endCall} className="text-2xl cursor-pointer"/>
    </div>

    </div> */}
    <div className="h-screen w-screen" ref={Mymeetings} >

    </div>
    
  </div>;
}

export default Container;
