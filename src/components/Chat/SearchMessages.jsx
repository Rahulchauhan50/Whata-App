import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { setMessageSearch } from "@/redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {BiSearchAlt2} from "react-icons/bi"
import { calculateTime } from "@/utils/CalculateTime";

function SearchMessages() {
  const dispatch = useDispatch();
  const [searchTrem, setsearchTrem] = useState('');
  const [searchedMessaged, setsearchedMessaged] = useState([])
  const { CurrentChatUser } = useSelector((state) => state.user)
  const { Messages } = useSelector((state) => state.user)

  useEffect(()=>{
    if(searchTrem){
      setsearchedMessaged(Messages.filter(message=>message.type==="text" && message.message.includes(searchTrem)))
    }else{
      setMessageSearch([])
    }
  },[searchTrem])
  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl"
          onClick={() => dispatch(setMessageSearch())}
        />
        <span>Search messages</span>
      </div>
      <div className="overflow-auto h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
              </div>
              <div>
                <input
                  className="bg-transparent text-sm focus:outline-none text-white w-full"
                  placeholder="Search messages"
                  type="text"
                  value={searchTrem}
                  onChange={(e)=>{setsearchTrem(e.target.value)}}
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
          {
            !searchTrem.length && `search for messages with ${CurrentChatUser.name}`
          }
          </span>
        </div>
        <div className="flex justify-center h-full flex-col" > 
        {
          searchTrem.length > 0 && !searchedMessaged.length && <span className="text-secondary w-full flex justify-center" >
            No messages found
          </span>
        }
        <div className="flex flex-col w-full h-full">
          {
            searchedMessaged.map((msg)=>{
              return <div className="flex cursor-pointer flex-col w-full px-5 border-b-[0.1px] py-5 border-secondary justify-center hover:bg-background-default-hover">
                <div className="text-secondary text-sm">
                  {calculateTime(msg.createAt)}
                </div>
                <div className="text-icon-green" >
                  {msg.message}
                  </div>

              </div>

            })
          }

        </div>

        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
