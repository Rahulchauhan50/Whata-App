import { FcGoogle } from 'react-icons/fc'
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '@/utils/FirebaseConfig';
import { useRouter } from 'next/router';
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUserInfo } from '@/redux/features/userSlice';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'




function login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { UserInfo } = useSelector((state) => state.user)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [valid, setValid] = useState(null)
  const [toggle, setToggled] = useState(null)


 const handleChange = (value) => {
  setPhoneNumber(value)
 }

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(firebaseAuth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(firebaseAuth);
      console.log(result)
      const user = result.user;

      if (user) {
        const email = user.email;
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });

        console.log(user)

        if (!data.status) {
          dispatch(setUserInfo({
            name: user.displayName,
            email: user.email,
            profileImageTemp: user.photoURL,
            status: "available",
            NewUser: true
          }));
          router.push("/onboarding");
        } else if (data.status) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleRedirectResult();
  }, []);

  const handlelogin = async () => {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(firebaseAuth, provider)
    const email = user.email;
    console.log(user);
    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        if (!data.status) {
          dispatch(setUserInfo({ name: user.displayName, email: user.email, profileImageTemp: user.photoURL, status: "available", NewUser: true }));
          router.push("/onboarding")
        } else if (data.status) {
          router.push("/")
        }
      }

    } catch (error) {
      console.log(error)
    }

  }

  return <>
  <div className='bg-cover bg-no-repeat bg-[#26A884] pt-[100px] h-[200px]'>
    
  </div >
  <div className='justify-center items-center mx-auto mt-[-100px] flex'>
      <div style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 30px rgba(0, 0, 0, 0.3)", }} className='bg-[#ffffff] md:w-[80vw] w-[95vw] justify-start items-center mb-14 flex flex-col rounded-lg' >
        <div className='justify-start items-center flex flex-col mt-[100px]'>
          <div className='justify-start items-center flex-col font-[300] text-[18px] md:text-[28px] text-[#41525D] m-1'>
            {toggle?"Enter Phone number":"Enter Phone number"}
          </div>
          <div className='font-[400] md:text-[16px] text-[10px] text-[#8696A0] m-1'>
          {toggle?"select your country and enter your whatsapp phone number":"select your country and enter your whatsapp phone number"}
          </div>
        </div>
        <div>
        {toggle?( <div className='my-12'><PhoneInput
          country={'in'}
          value={phoneNumber}
          onChange={handleChange}
          
          /></div>):(<div style={{ boxShadow: "0px 4px 0px rgba(250, 250, 250, 0.9), 0 4px 30px rgb(181 181 181 / 41%)", }} className='flex flex-row justify-between my-12'>
          <button
            onClick={handlelogin}
            className="flex font-[600] items-center justify-center w-full h-[42px] py-2 px-4  text-slate-600 rounded-md shadow-md"
          >
            <img alt='googe' className="w-8 h-8 rounded-[10px]  my-4 cursor-pointer mr-2" src='./google.svg' />
            Sign In with Google
          </button>
        </div>)}
        </div>
        <div className='font-[400] md:text-[18px] text-[14px] text-[#008069] m-1 cursor-pointer' onClick={()=>{setToggled(!toggle)}}>{toggle?"Link with Google account":"Link with Phone Number"}</div>
       
        <div className='mt-12 bg-[#F9F9FA] w-full py-8' >
          <div className='font-[300] items-center justify-center flex text-[18px] md:text-[28px] text-[#41525D] m-1'>
            Tutorial
          </div>
          <div className='font-[400] md:text-[14px] text-[12px] items-center justify-center flex text-[#008069] m-1'>Need help to get Started</div>
          <div className='flex items-center justify-center m-14'>
          <Image src='/tutorial.png' alt="whatsapp" height={500} width={500} />
        </div>
      </div>
    </div>
  </div>
  </>
}

export default login;