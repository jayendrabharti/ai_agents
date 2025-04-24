"use client";
import React, { useEffect, useState } from 'react';
import { LoaderCircle, MessageCircle} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';



export default function AgentCard2({ agent }) {

  const [startingChat, setStartingChat] = useState(false);

    return (
      <div key={agent.name} className="flex flex-col">
      <Image
        src={agent.imageUrl1}
        alt={agent.name}
        width={300}
        height={300}
        className="mx-auto size-96"
      />
      
      <div className="bg-zinc-800 backdrop-blur-sm p-6 flex-1 rounded-2xl">
        <h3 className="text-2xl font-bold text-white mb-2">
          {agent.name}
        </h3>
        <p className="text-emerald-400 font-medium mb-2">
          {agent.role}
        </p>
        <p className="text-gray-300 text-sm mb-4">
          {agent.description}
        </p>
        <Link
          href={agent.href}
          onClick={() => setStartingChat(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors duration-300"
        >
          Start Chat
          <MessageCircle className='ml-2'/>
        </Link>
      </div>

      {startingChat && (
      <dialog 
        className='flex flex-col items-center text-emerald-500 justify-center bg-[rgba(0,0,0,0.5)] z-[100] fixed top-0 left-0 w-full h-full'
      >
        <LoaderCircle className="animate-spin size-24"/>
        <span className='font-bold text-4xl'>Starting Chat...</span>
      </dialog>
      )}

    </div>
    );
}

