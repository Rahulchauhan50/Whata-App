import React from "react";
import { calculateTime } from "@/utils/CalculateTime";
import { useSelector } from "react-redux";
import Image from "next/image";
import { HOST } from "@/utils/ApiRoutes";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  const { CurrentChatUser } = useSelector((state) => state.user);
  const { UserInfo } = useSelector((state) => state.user);

  return (
    <div
      className={`p-1 rounded-lg ${
        message.senderId === CurrentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="relative">
        <Image
          src={`${HOST}/${message.message}`}
          className="rounded-lg"
          height={300}
          width={300}
          alt="asset"
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
            {calculateTime(message.createAt)}
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
