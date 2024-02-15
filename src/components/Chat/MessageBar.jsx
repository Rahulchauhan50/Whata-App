import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE, GET_INITIAL_CONTACT_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setAddMessages, setOnlineUser, setUserContacts } from "@/redux/features/userSlice";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";
import { FaMicrophone } from "react-icons/fa";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(()=> import("../common/CaptureAudio"),{
  ssr:false
}) ;

function MessageBar({ socket }) {
  const [Message, setMessage] = useState("");
  const [grabPhoto, setgrabPhoto] = useState(false);
  const [showEmojiPicker, setshowEmojiPicker] = useState(false);
  const [showAudioRecorder, setshowAudioRecorder] = useState(false);

  const { UserInfo } = useSelector((state) => state.user);
  const { CurrentChatUser } = useSelector((state) => state.user);
  const emojiPickerRef = useRef(null);
  const dispatch = useDispatch();

  const HandleEmojiModel = () => {
    setshowEmojiPicker(!showEmojiPicker);
  };

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const resopnse = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multitpart/form-data",
        },
        params: {
          from: UserInfo.id,
          to: CurrentChatUser.id,
        },
      });
      console.log(resopnse)
      if (resopnse.status === 201) {
        console.log(resopnse);
        dispatch(
          setAddMessages({
            senderId: UserInfo?.id,
            message: resopnse.data,
            recieverId: CurrentChatUser?.id,
            type: "image",
            createdAt: Date.now(),
            messageStatus: resopnse.data.msgStatus,
          })
        );
        socket.current.emit("send-msg", {
          senderId: UserInfo?.id,
          message: resopnse.data,
          recieverId: CurrentChatUser?.id,
          type: "image",
          createdAt: Date.now(),
          messageStatus: resopnse.data.msgStatus,
          original:true
        });
        getContacts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userTyping = () => {
    socket.current.emit("typing", {
      recieverId: CurrentChatUser?.id,
    });
  }

  const userTypingblur = () => {
    socket.current.emit("typingblur", {
      recieverId: CurrentChatUser?.id,
    });
  }

  const HandleEmojiClick = (emoji) => {
    setMessage((preMeessage) => (preMeessage += emoji.emoji));
  };

  useEffect(() => {
    const HandleOutside = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setshowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", HandleOutside);
    return () => {
      document.removeEventListener("click", HandleOutside);
    };
  },[]);

  const getContacts = async () =>{
    try {
      const {data:{users,onlineUsers}} = await axios.get(`${GET_INITIAL_CONTACT_ROUTE}/${UserInfo?.id}`)
      dispatch(setOnlineUser({onlineUsers}));
      dispatch(setUserContacts({userContacts:users}));
    } catch (error) {
      console.log(error)
    }
  }

  const sendMessage = async (e) => {
    setMessage("");
    e.preventDefault();
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: CurrentChatUser?.id,
        from: UserInfo?.id,
        message: Message,
      });
      
      dispatch(
        setAddMessages({
          senderId: UserInfo?.id,
          message: Message,
          recieverId: CurrentChatUser?.id,
          type: "text",
          createdAt: Date.now(),
          messageStatus: data.message.messageStatus,
        })
      );
      socket.current.emit("send-msg", {
        senderId: UserInfo?.id,
        message: Message,
        recieverId: CurrentChatUser?.id,
        type: "text",
        createdAt: Date.now(),
        messageStatus: "sent",
      });
      getContacts()
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setgrabPhoto(false);
        }, 5000);
      };
    }
  }, [grabPhoto]);

  return (
    <div className="bg-panel-header-background md:h-20 h-[80px] px-4 flex items-center gap-6 md:w-auto w-full md:relative fixed bottom-0 left-0 ">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              id="emoji-open"
              onClick={HandleEmojiModel}
              className="cursor-pointer text-panel-header-icon text-xl"
              title="Emoji"
            />
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute md:bottom-10 bottom-20 md:left-16 left-2  z-40"
              >
                <EmojiPicker width={window.innerWidth< 768 ?window.innerWidth-15:400} onEmojiClick={HandleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              onClick={() => {
                setgrabPhoto(true);
              }}
              className="cursor-pointer text-panel-header-icon text-xl"
              title="Attachment"
            />
          </div>
          <form
            onSubmit={sendMessage}
            className="w-full rounded-lg h-10 flex items-center"
          >
            <input
              onFocus={userTyping}
              onBlur={userTypingblur}
              value={Message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type a message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            />
          </form>
          <div className="flex w-10 items-center justify-center">
            <button type="submit">
              {Message.length ? (
                <MdSend
                  onClick={sendMessage}
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record"
                  onClick={() => setshowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setshowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
