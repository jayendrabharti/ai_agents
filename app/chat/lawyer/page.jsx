"use client";
import { Canvas } from "@react-three/fiber";
import LawyerModel from './LawyerModel';
import { MessageBubble } from '@/components/MessageBubble';
import { MessageInput } from '@/components/MessageInput';
import { ChatHeader } from '@/components/ChatHeader';
import { useChat } from '@/hooks/useChat';
import { useState, useEffect, useRef, useMemo } from 'react';
import playTextToSpeech from "@/utils/PlayAudio";
import { extractTextFromMarkdown } from "@/utils/common";
import VoiceRecognition from "@/components/VoiceRecognition";
import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

const modelurl = "https://models.readyplayer.me/67af4a20a277aa53024f777d.glb"

export default function LawyerAgent(){

  const { messages, addMessage } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const scrollDivRef = useRef(null);
  const [playingAudio,setPlayingAudio] = useState(false);

  const handleSendMessage = (content) => {
        
    addMessage(content, 'user');
    setIsLoading(true);

    fetch(`/api/chat?prompt=${content}`).then((res) => res.json()).then(async(data) => {
      console.log(data);
        setIsLoading(false);
        const { sound } = await playTextToSpeech(extractTextFromMarkdown(data.message));
        sound.on('play',()=>setPlayingAudio(true));
        sound.on('end',()=>{
          setPlayingAudio(false)
          addMessage(data.message, 'assistant');
        });
        sound.play();
    });
  };



  useEffect(() => {
    scrollDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const memoizedCanvas = useMemo(() => (
    <div className="w-full h-full max-h-screen max-w-full relative">
    <img src="/api/media/lawyerBackground" className=" z-0 absolute top-0 left-0 w-full h-full"/>
    <Canvas 
      shadows camera={{ position: [0, 0, 8], fov: 42 }}
    >
      {/* <color attach="background" args={["#ececec"]} /> */}
      <LawyerModel speaking={playingAudio}/>
    </Canvas>
    </ div>
  ), [playingAudio]);

  return (
  <>
  <div className='grid grid-cols-[2fr_1fr] h-full'>
    
    <div className="relative">
      {memoizedCanvas}
      <VoiceRecognition onSubmit={handleSendMessage} />
    </div>
    
    <div
      className='w-full h-full max-h-full grid grid-rows-[auto_1fr_auto]'
      >
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-700 relative">
          
          {messages.map((message, index) => {
            return <MessageBubble key={index} message={message} />
          })}

          {isLoading && 
          <div
          className={`rounded-xl p-2 w-max max-w-[70%] break-words bg-[#333] text-gray-400 mr-auto`}
          >
              <div className='animate-bounce inline-block delay-100 mx-1 font-extrabold'>•</div>
              <div className='animate-bounce inline-block delay-200 mx-1 font-extrabold'>•</div>
              <div className='animate-bounce inline-block delay-300 mx-1 font-extrabold'>•</div>
          </div> }
          
          {playingAudio &&
            <div
            className={`rounded-xl p-2 w-max max-w-[70%] break-words bg-[#333] text-gray-400 mr-auto`}
            >Speaking...</div>
          }

          {(!playingAudio && !isLoading && !messages.length) &&
          <div className="text-gray-500 text-2xl text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute font-extrabold w-max" >
            Write a message
            <br />
            or
            <br />
            Speak using mic
          </div>
          }
          <div ref={scrollDivRef}/>
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  </div>
  </>
  )
}
