import Main from "@/components/Main";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/features/userSlice";


function index() {

  const router = useRouter();
  const dispatch = useDispatch();

  onAuthStateChanged(firebaseAuth,async (currentUser) => {
      if(!currentUser) router.push('/login')
      if(currentUser?.email){
        const {data} = await axios.post(CHECK_USER_ROUTE,{email:currentUser.email});
        if(!data.status){
          router.push('/login')
        }
        console.log(data)
        console.log(currentUser)
        dispatch(setUserInfo({name:data.data.name,email:data.data.email,profileImage:data.data.profileImage, status:"available",NewUser:false}));
      }
  })
  return <Main/>;
}

export default index;
