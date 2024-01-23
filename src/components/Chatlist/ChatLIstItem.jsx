import React from "react";
import Avatar from "../common/Avatar";
import { setCurrentChatUser } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ data, isContactpage = false }) {
  const dispatch = useDispatch();
  const { CurrentChatUser } = useSelector((state) => state.user)
  const { UserInfo } = useSelector((state) => state.user)

  const HandleContactClick = () => {
    if (data?.id !== CurrentChatUser?.id) {
      dispatch(setCurrentChatUser({ data }));
      console.log(data)
    }
  }

  return <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`} onClick={HandleContactClick} >
    <div className="min-w-fit px-5 pt-3 pb-1">
      <Avatar type="lg" image={data?.profileImage} />
    </div>
    <div className="min-h-fit flex flex-col justify-center mt-3 pr-2 w-full ">
      <div className="flex justify-between ">
        <div>
          <span className="text-white">{data?.name}</span>
        </div>
        {
          !isContactpage && (
            <div>
              <span className={`${true ? "text-secondary" : "text-icon-green"} text-sm`} >
                {calculateTime(data?.createAt)}
              </span>
            </div>
          )
        }

      </div>
      <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2 " >
        <div className="flex justify-between w-full ">
          <span className="text-secondary line-clamp-1 text-sm">
            {isContactpage ? data?.about || "\u00A0":
            <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
              {
                data.senderId === UserInfo?.id? <MessageStatus messageStatus={data.messageStatus}/>:""
              }
              {
                data.type === "text" ? <span className="truncate">{data.message}</span>:""
              }
              {
                data.type === "audio" ? <span className="flex gap-1 items-center"><FaCamera/>Image</span>:""
              }
              {
                data.type === "audio" ? <span className="flex gap-1 items-center"><FaMicrophone className="text-panel-header-icon" />Audio</span>:""
              }
              </div>}
            </span>
        </div>

      </div>
    </div>

  </div>;
}

export default ChatLIstItem;
