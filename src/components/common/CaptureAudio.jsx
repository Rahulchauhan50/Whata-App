import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {FaMicrophone,FaPauseCircle,FaPlay,FaStop,FaTrash} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { useDispatch, useSelector } from "react-redux";
import { setAddMessages } from "@/redux/features/userSlice";


function CaptureAudio({ hide, socket}) {
  const dispatch = useDispatch();
  const { UserInfo } = useSelector((state) => state.user);
  const { CurrentChatUser } = useSelector((state) => state.user);
  

  const [IsRecording, setIsRecording] = useState(false);
  const [RecordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [RecordingDuration, setRecordingDuration] = useState(0);
  const [CurrentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [TotalDuration, setTotalDuration] = useState(0);
  const [IsPlaying, setIsPlaying] = useState(false);
  const [renderAudio, setrenderAudio] = useState(null)
  // const [AudioWave, setAudioWave] = useState(null);

  const AudioRef = useRef(null);
  const MediaRecorderRef = useRef(null);
  const WaveFormRef = useRef(null);

  useEffect(()=>{
    var interval; 
    if(IsRecording){
      interval = setInterval(() => {
        setRecordingDuration((prevDuration)=>{
          setTotalDuration(prevDuration+1);
          return prevDuration+1
        })
      }, 1000);
    }

    return () => {
      clearInterval(interval)
    }
  },[IsRecording])

  const handleStartRecording = () => {
    setRecordingDuration(0)
    setTotalDuration(0)
    setCurrentPlayBackTime(0)
    setIsRecording(true)
    setrenderAudio(null)
    navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
      const mediaRecorder = new MediaRecorder(stream)
      MediaRecorderRef.current = mediaRecorder;
      AudioRef.current.srcObject = stream;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type:"audio/ogg; codecs=opus"})
          const audioURL = URL.createObjectURL(blob)
          const audio = new Audio(audioURL)
          setRecordedAudio(audio)

          waveForm.load(audioURL);
      };

      mediaRecorder.start();
    }).catch(error=>{
      console.error("error accessing microphone",error)
    })
  };
  
  const handleStopRecording = () => {
    if(MediaRecorderRef.current && IsRecording){
      MediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks =  [];
      MediaRecorderRef.current.addEventListener("dataavailable",(event)=>{
        audioChunks.push(event.data);
      });

      MediaRecorderRef.current.addEventListener("stop",()=>{
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        

        const audio = new Audio(URL.createObjectURL(audioFile));
        setRecordedAudio(audio);
        setrenderAudio(audioFile);
      })

        const mediaStream = AudioRef.current.srcObject;
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      AudioRef.current.srcObject = null;

      console.log(AudioRef)
    }
  };

  const handlePlayRecording = () => {
    if(RecordedAudio){
      waveForm.stop()
      waveForm.play()
      RecordedAudio.play()
      setIsPlaying(true)
    }
  };

  const handlePauseRecording = () => {
    waveForm.stop();
    RecordedAudio.pause();
    setIsPlaying(false)
  };

  const sendRecording = async () => {
    if(IsRecording){
      handleStopRecording()
    }
    try {
      hide();
      const formData = new FormData();
      formData.append("audio", renderAudio);

      const resopnse = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: UserInfo.id,
          to: CurrentChatUser.id,
        },
      });
      if (resopnse.status === 201) {
        console.log(resopnse);
        dispatch(
          setAddMessages({
            senderId: UserInfo?.id,
            message: resopnse.data.message.message,
            recieverId: CurrentChatUser?.id,
            type: "audio",
            createdAt: Date.now(),
            messageStatus: resopnse.data.message.messageStatus,
          })
        );
        socket.current.emit("send-msg", {
          senderId: UserInfo?.id,
          message: resopnse.data.message.message,
          recieverId: CurrentChatUser?.id,
          type: "audio",
          createdAt: Date.now(),
          messageStatus:  resopnse.data.message.messageStatus,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (waveForm) handleStartRecording();
  }, [waveForm]);

  useEffect(()=>{
    if(RecordedAudio){
      const updatePlayBackTime = ()=>{
        setCurrentPlayBackTime(RecordedAudio.currentTime)
      };
      RecordedAudio.addEventListener("timeupdate", updatePlayBackTime)

      return(()=>{
        RecordedAudio.removeEventListener("timeupdate", updatePlayBackTime)
      })
    }
  }, [RecordedAudio]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: WaveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  },[]);


  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          onClick={() => hide()}
          className="text-panel-header-icon cursor-pointer"
        />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {IsRecording ? (
          <div className="text-red-500 animate-pulse w-60 text-center ">
            Recording <span>{RecordingDuration}s</span>
          </div>
        ) : (
          <div>
            {RecordedAudio && (
              <>
                {!IsPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={WaveFormRef} hidden={IsRecording}/>
          {RecordedAudio && IsPlaying && (
            <span>{formatTime(CurrentPlayBackTime)}</span>
          )}
          {RecordedAudio && !IsPlaying && (
            <span>{formatTime(TotalDuration)}</span>
          )}
          <audio ref={AudioRef} hidden />
          </div>
          <div className="mr-4">
            {!IsRecording ? (
              <FaMicrophone
                onClick={handleStartRecording}
                className="text-red-500"
              />
            ) : (
              <FaPauseCircle
                onClick={handleStopRecording}
                className="text-red-500"
              />
            )}
          </div>
          <div>
            <MdSend
              className="text-panel-header-icon cursor-pointer mr-4"
              title="send"
              onClick={sendRecording}
            />
          </div>
       
     
    </div>
  );
}

export default CaptureAudio;
