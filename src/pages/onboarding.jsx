import React from "react";
import Image from "next/image"


function onboarding() {
  return <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
    <div className="flex items-center justify-center gap-2">
      <Image src='/whatsapp.gif' alt="whatsapp" height={300} width={300}/>
      <span className="text-6xl">Whatsapp</span>
    </div>
    <h6 className="text-2xl">Create your account</h6>
      <div className="flex mt-6 gap-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
        </div>
      </div>
  </div>;
}

export default onboarding;
