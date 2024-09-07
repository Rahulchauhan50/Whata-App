import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import userSlice, { setUserInfo } from '@/redux/features/userSlice';
import Image from "next/image";
import { FaCamera } from "react-icons/fa"
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";
import { HOST } from "@/utils/ApiRoutes";

function Avatar({ type, image, setimage, setprofileImageUpload }) {
  const { UserInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const [Hover, setHover] = useState(false)
  const [IsContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [contextMenuCordinates, setcontextMenuCordinates] = useState({x:0,y:0})
  const [grabPhoto, setgrabPhoto] = useState(false)
  const [showPhotoLibrary, setshowPhotoLibrary] = useState(false)
  const [showCapturePhoto, setshowCapturePhoto] = useState(false)

  const contextMenuOptions = [
    {name:"Take Photo",callback:() => {
      setshowCapturePhoto(true)
    }},
    {name:"Choose from gallery",callback:() => {
      setshowPhotoLibrary(true)
    }},
    {name:"Upload Photo",callback:() => {
      setgrabPhoto(true)
    }},
    {name:"Remove Photo",callback:() => {
      dispatch(setUserInfo({profileImageTemp:"/default_avatar.png"}));
    }}
  ]

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true)
    setcontextMenuCordinates({x:e.pageX,y:e.pageY})

  }

  useEffect(()=>{
    if(grabPhoto){
      const data = document.getElementById("photo-picker")
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(()=>{
          setgrabPhoto(false)
        },5000)
      }
    }
  },[grabPhoto])

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    setprofileImageUpload(file)
    const reader = new FileReader();
    const data = document.createElement('img');
    reader.onload = function (event){
      data.src = event.target.result;
      data.setAttribute("data-src",event.target.result)
    }
    reader.readAsDataURL(file)
    setTimeout(()=>{
      dispatch(setUserInfo({profileImageTemp:data.src}));
      dispatch(setUserInfo({profileImage:null}));
    },3000)

  }
  
  return <>
    <div className="flex items-center justify-center">
      {type == "sm" && (
        <div className="context-openers relative h-10 w-10">
          <Image src={image} className="rounded-full" alt="avatar" width={50} height={50}/>
        </div>
      )}
      {type == "lg" && (
        <div className="context-openers relative h-14 w-14">
          <Image src={image} className="rounded-full" alt="avatar" width={50} height={50}/>
        </div>
      )}
      {type == "xl" && (
        <div className="context-openers relative cursor-pointer z-0" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
          <div onClick={e=>showContextMenu(e)} className={`z-10 context-openers bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${Hover?"visible":"hidden"}`}>
            <FaCamera className="text-2xl"/>
            <span className="context-openers">Change profile photo</span>
          </div>
        <div onClick={e=>showContextMenu(e)} className="context-openers flex items-center h-60 w-60">
          <Image src={UserInfo?.profileImageTemp} className="context-openers rounded-full bg-[#233138]" alt="avatar" height={250} width={250}/>
        </div>
        </div>
      )}
    </div>
    <div>
      {IsContextMenuVisible && <ContextMenu options={contextMenuOptions} cordinate={contextMenuCordinates} contextMenu={IsContextMenuVisible} setContextMenu={setIsContextMenuVisible}/>}
      {showPhotoLibrary && <PhotoLibrary hidePhotoLibrary={setshowPhotoLibrary} />}
      {showCapturePhoto && <CapturePhoto setprofileImageUpload={setprofileImageUpload} hide={setshowCapturePhoto} /> }
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </div>


  </>
}

export default Avatar;
