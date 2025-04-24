"use client";

import { MessageBubble } from '@/components/MessageBubble';
import { MessageInput } from '@/components/MessageInput';
import { ChatHeader } from '@/components/ChatHeader';
import { useChat } from '@/hooks/useChat';
import { useState, useEffect, useRef, useMemo } from 'react';
import { extractTextFromMarkdown } from "@/utils/common";
import { ClearChat, GetChat, SendAndGetMessage } from '@/actions/chat';
import agents from '@/agents/agents';
import { useParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { playTextToSpeech } from '@/utils/PlayAudio';
import ThreeDAgent from './ThreeDAgent';
import VoiceRecognition from "@/components/VoiceRecognition";


export default function Agent(){

  const {agentName} = useParams();
  const agentData = agents[agentName];
  const { messages, setMessages, addMessage } = useChat();
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking,setIsSpeaking] = useState(false);
  const [isThinking,setIsThinking] = useState(false);
  const [lipSyncData,setLipSyncData] = useState(null);
  const [audio,setAudio] = useState(null);
  const scrollDivRef = useRef(null);
  const [clearing, setClearing] = useState(false);

  const handleSendMessage = async(content) => {
        
    addMessage(content, 'user');
    setIsThinking(true);
    const response = JSON.parse(await SendAndGetMessage(agentName,content));
    const aiMessage = response.message;
    const text = extractTextFromMarkdown(aiMessage);
    const { sound, lipSyncData: lsd } = await playTextToSpeech(text);
    setLipSyncData(JSON.parse(lsd));
    setAudio(sound);
    sound.on('play', ()=>{
      setIsThinking(false);
      addMessage(aiMessage,"model");
      setIsSpeaking(true);
    });
    sound.on('end', ()=>{
      setIsSpeaking(false);
    });
    sound.play();
  };

  const clearChat = async () => {
    if (messages.length == 0) {
      alert("No chat history to clear.");
      return;
    }
  
    try {
      setClearing(true);
      const cleared = JSON.parse(await ClearChat(agentName));
      if (cleared.success) {
        setMessages([]);
        alert("Chat history cleared successfully.");
        setClearing(false);
      } else {
        console.warn("ClearChat returned false for agent:", agentName);
        alert("Error clearing chat history. Please try again.");
      }
  
    } catch (error) {
      console.error("Error during ClearChat:", error);
      alert("An unexpected error occurred while clearing the chat.");
    }
  };

  useEffect(() => {
    const get = async () => {
      const data = JSON.parse(await GetChat(agentName));
      const chatHistory = JSON.parse(data.chatHistory);
      if (chatHistory.length > 0) {
        setMessages([]);
        chatHistory.forEach(message => {
          addMessage(message.parts[0].text, message.role);
        });
      }
      setIsLoading(false);
    };
    get();
  }, [agentName, setMessages, addMessage]);

  useEffect(() => {
    scrollDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(()=>{
    const get = async ()=>{
      const data = JSON.parse(await GetChat(agentName));
      const chatHistory = JSON.parse(data.chatHistory);
      setMessages([]);
      chatHistory.forEach(messages => {
        addMessage(messages.parts[0].text,messages.role)
      });    
      setIsLoading(false);
    }
    get();
  },[])

  return (
  <div className='grid grid-cols-[2fr_1fr] h-full max-h-full overflow-hidden bg-cover bg-center'
    style={{backgroundImage: `url(${agentData.backgroundImage})`}}
  >
    
    <div className="h-full max-h-full w-full relative">
        <ThreeDAgent 
          agentData={agentData}
          lipSyncData={lipSyncData}
          isSpeaking={isSpeaking}
          isThinking={isThinking}
          audio={audio}
        />
        {/* <VoiceRecognition onSubmit={handleSendMessage} /> */}
    </div>
    
    <div
      className='w-full h-full max-h-full grid grid-rows-[auto_1fr_auto] overflow-hidden'
      >
      <ChatHeader 
        agentData={agentData}
        clearChat={clearChat}
        messages={messages}
        clearing={clearing}
        deleteDisabled={messages.length == 0 || isSpeaking || isThinking || isLoading || clearing}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[rgba(0,0,0,0.7)] relative">
          
          {messages.map((message, index) => {
            return (
              <MessageBubble 
                key={index} 
                agentName={agentData.name} 
                speaking={isSpeaking && index+1==messages.length} 
                ref={index+1==messages.length ? scrollDivRef : null} 
                message={message} 
              />
            )
          })}

          {isThinking && 
          <div
          className={`rounded-xl p-2 w-max max-w-[70%] break-words bg-[#333] text-white mr-auto flex flex-row justify-center items-center`}
          >
            <span>Thinking</span>
            <div className='size-8 ml-2'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <circle fill="#FFF" stroke="#FFF" strokeWidth="15" r="15" cx="40" cy="65">
                  <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                </circle>
                <circle fill="#FFF" stroke="#FFF" strokeWidth="15" r="15" cx="100" cy="65">
                  <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                </circle>
                <circle fill="#FFF" stroke="#FFF" strokeWidth="15" r="15" cx="160" cy="65">
                  <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                </circle>
              </svg>
            </div>
          </div> }

          {(!isLoading && !messages.length) &&
          <div className="text-gray-400 text-2xl text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute font-extrabold w-max" >
            Write a message
            <br />
            or
            <br />
            Speak using mic
          </div>
          }

          {isLoading && 
            <div className='w-full h-full flex justify-center items-center'>
              <LoaderCircle className='size-16 animate-spin text-white'/>
            </div>
          }


      </div>
      
      <MessageInput onSendMessage={handleSendMessage} />
    
    </div>

  </div>
  )
}
