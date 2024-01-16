import { FcGoogle } from 'react-icons/fc'
import React from "react";
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '@/utils/FirebaseConfig';
import { useRouter } from 'next/router';
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserInfo } from '@/redux/features/userSlice';

function login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { UserInfo } = useSelector((state) => state.user)

  const handlelogin = async () => {
    const provider = new GoogleAuthProvider()
    const {user} = await signInWithPopup(firebaseAuth,provider)
    const email = user.email;
    console.log(user);
    try {
      if(email){
        const {data} = await axios.post(CHECK_USER_ROUTE,{email});
        if(!data.status){
         dispatch(setUserInfo({name:user.displayName,email:user.email,profileImage:user.photoURL, status:"available", NewUser:true}));
         router.push("/onboarding")
        }else if(data.status){
          router.push("/")
        }
      }
      
    } catch (error) {
      console.log(error)
    }

  } 

  return <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
    <div className="flex items-center justify-center gap-2 text-white">
    <Image src='/whatsapp.gif' alt="whatsapp" height={300} width={300} />
      <span className="text-7xl">Whatsapp</span>
    </div>
    <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg" onClick={handlelogin}>
      <FcGoogle className="text-4xl"/>
      <span className="text-white text-2xl">Login with Google</span>
    </button>
  </div>;
}

export default login;
 