import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setConstactPage } from "@/redux/features/userSlice";
import { BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setallContacts] = useState([]);
  const dispatch = useDispatch();

  const getContacts = async () => {
    try {
      const {
        data: { users },
      } = await axios.get(GET_ALL_CONTACTS);
      setallContacts(users);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getContacts();
  }, []);
  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => {
              dispatch(setConstactPage());
            }}
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar-color">
        <div className="flex py-3 items-center gap-3 h-14 ">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div>
              <input
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                placeholder="search Contacts"
                type="text"
              />
            </div>
          </div>
        </div>
        {Object.entries(allContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
              {userList.map((contacts) => {
                return <ChatLIstItem className="" data={contacts} isContactpage={true} key={contacts.id} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
