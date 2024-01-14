import React, { useEffect } from "react";
import Image from "next/image"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserInfo } from '@/redux/features/userSlice';
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import axios from "axios";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";

function onboarding() {
  const router = useRouter();
  const { UserInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const onBoardUserHandler = async () => {
    if(validateDetails()){
      const email = UserInfo?.email;

      try {
        const {data} = await axios.post(ONBOARD_USER_ROUTE,{
        email,
        name:UserInfo.name,
        about:UserInfo.about,
        image:UserInfo.profileImage,
        })
        if(data.Success){
          router.push('/')
        }
      } catch (error) {
        
      }
    }
  }

  const validateDetails = () => {
    if(UserInfo?.name.length < 3 || UserInfo?.about < 1){
      return false
    }
    return true
  }

  useEffect(()=>{
    if(!UserInfo?.NewUser && !UserInfo?.email ){
      router.push("/login");
    }else if(!UserInfo?.NewUser && UserInfo?.email){
      router.push('/')
    }
  },[UserInfo,router])

  return <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
    <div className="flex items-center justify-center gap-2">
      <Image src='/whatsapp.gif' alt="whatsapp" height={300} width={300} />
      <span className="text-6xl">Whatsapp</span>
    </div>
    <h6 className="text-2xl">Create your account</h6>
    <div className="flex mt-6 gap-6">
      {console.log(UserInfo)}
      <div className="flex flex-col items-center justify-center mt-5 gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-teal-light text-lg px-1" >
            Display Name
          </label>
          <div>
            <input type="text" name={UserInfo?.name} value={UserInfo?.name} onChange={(e) => { dispatch(setUserInfo({ name: e.target.value })); }} className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full" ></input>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="About" className="text-teal-light text-lg px-1" >
            About
          </label>
          <div>
            <input type="text" name={UserInfo?.about} value={UserInfo?.about} onChange={(e) => { dispatch(setUserInfo({ about: e.target.value })); }} className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full" ></input>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button onClick={onBoardUserHandler} className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg">Create Profile</button>

        </div>
      </div>
      <div>
        <Avatar type='xl' />
      </div>

    </div>
  </div>;
}

export default onboarding;
