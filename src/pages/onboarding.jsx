import React, { useEffect, useState } from "react";
import Image from "next/image"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserInfo } from '@/redux/features/userSlice';
import Avatar from "@/components/common/Avatar";
import axios from "axios";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";

function onboarding() {
  const router = useRouter();
  const { UserInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const [profileImageUpload,setprofileImageUpload] = useState(null)

  const onBoardUserHandler = async () => {
    if(validateDetails()){
      console.log("sdhjdshj")
      console.log(UserInfo.profileImage)
     
      try {
       
          const formData = new FormData();
          formData.append("image", profileImageUpload);
  
          const {data} = await axios.post(ONBOARD_USER_ROUTE,formData,{
            headers:{
              "Content-Type": "multitpart/form-data",
            },
            params:{
              email:UserInfo.email,
              name:UserInfo.name,
              about:UserInfo.about,
              image:UserInfo.profileImage
              }
          })
          if(data.status){
            router.push('/')
          }
          
        
      } catch (error) {
        console.log(error)
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
      router.push("/login")
    }else if(!UserInfo?.NewUser && UserInfo?.email){
      router.push('/')
    }
  },[UserInfo,router])

  return <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-around md:justify-center">
    <h6 className="md:text-2xl text-xl">Create your account</h6>
    <div className="flex flex-col-reverse md:flex-row mt-6 gap-6">
    
      <div className="flex flex-col items-center justify-center mb-4 mt-5 gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-teal-light text-lg px-1" >
            Display Name
          </label>
          <div>
            <input type="text" name={UserInfo?.name} value={UserInfo?.name} onChange={(e) => { dispatch(setUserInfo({ name: e.target.value })); }} className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-[90vw] md:w-full" ></input>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="About" className="text-teal-light text-lg px-1" >
            About
          </label>
          <div>
            <input type="text" name={UserInfo?.about} value={UserInfo?.about} onChange={(e) => { dispatch(setUserInfo({ about: e.target.value })); }} className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-[90vw] md:w-full" ></input>
          </div>
        </div>
       
      </div>
      <div>
        <Avatar type='xl' image={UserInfo?.profileImage} setprofileImageUpload={setprofileImageUpload}/>
      </div>
      
    </div>
    <div className="flex items-center justify-center">
          <button onClick={onBoardUserHandler} className="flex md:w-auto w-[90vw] items-center justify-center gap-7 bg-[#26A884] rounded-3xl p-2 md:p-5 ">Create Profile</button>

        </div>
  </div>
}

export default onboarding;
