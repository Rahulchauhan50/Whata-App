import React from "react";
import {IoClose} from 'react-icons/io5'
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserInfo } from '@/redux/features/userSlice';

function PhotoLibrary({hidePhotoLibrary}) {
  const dispatch = useDispatch();
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ]
  const handleclick = (img) => {
    dispatch(setUserInfo({profileImage:img}));
    dispatch(setUserInfo({profileImageTemp:img}));
    hidePhotoLibrary(false)

  }
  return <div className="fixed top-0 left-0 max-h-[100vh] max-width-[100vw] flex h-full w-full justify-center items-center">
    <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4">
      <div onClick={()=>{hidePhotoLibrary(false)}} className="pt-2 pe-2 cursor-pointer flex items-end justify-end">
        <IoClose className='h-10 w-10 cursor-pointer' />
      </div>
      <div className="grid grid-cols-3 justify-center items-center gap-16 p-20 w-full">
        {images.map((img,i)=>(
          <div onClick={()=>handleclick(img)}>
            <div className="h-24 w-24 cursor-pointer relative">
              <Image src={img} alt='avatar' fill />

            </div>
          </div>
        ))}

      </div>
    </div>

  </div>;
}

export default PhotoLibrary;
