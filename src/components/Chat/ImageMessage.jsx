import React, { useEffect, useState } from "react";
import { calculateTime } from "@/utils/CalculateTime";
import { useSelector } from "react-redux";
import Image from "next/image";
import { GET_IMAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import MessageStatus from "../common/MessageStatus";
import axios from "axios";
import { FaCamera } from "react-icons/fa";

function ImageMessage({ message }) {
  const { CurrentChatUser } = useSelector((state) => state.user);
  const { UserInfo } = useSelector((state) => state.user);
  const [imagereso, setimagereso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const highResolutionImage = async () => {
    try {
      const data = await axios.get(`${GET_IMAGE_ROUTE}/${message.message.originalId}`);
      // if(data.data.message.success){
        setimagereso(data.data.message);
        setIsLoading(false); // Set loading to false once the image is loaded
      // }
    } catch (error) {
      console.error("Error loading high-resolution image", error);
      setIsLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(()=>{
    setimagereso(message.message.msg)
    if(!message.message.original){
      highResolutionImage();
    }
  },[message])

  return (
    <div
      className={`p-1 rounded-lg ${
        message.senderId === CurrentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="relative">
          <div  className={`z-10 absolute top-0 w-full h-full left-0 flex items-center justify-center flex-col text-center gap-2 ${isLoading?"visible":"md:hidden"}`}>
            {/* <FaCamera className="text-2xl"/> */}
            <Image src='./Rolling.svg' width={100} height={100} alt="gh" />
          </div>
        <Image
          src={`data:image/png;base64,${imagereso}`}
          className="rounded-lg"
          height={300}
          width={300}
          alt="asset"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
          {calculateTime(message.createdAt)}
          </span>
          <span className="text-bubble-meta">
            {
              message.senderId === UserInfo.id  && <MessageStatus messageStatus={message.messageStatus} />
            }
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImageMessage;
