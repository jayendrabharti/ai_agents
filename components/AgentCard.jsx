import React from 'react';
import { MessageCircle} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AgentCard({ agent }) {

    return (
        <div
            key={agent.name}
            className="group flex flex-col bg-zinc-800 rounded-4xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl p-4"
          >
            <div className="relative h-[300px] overflow-hidden rounded-2xl">
              {/* Background Image */}
              <Image
                src={agent.imageUrl2}
                alt={agent.name}
                width={300}
                height={300}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:blur-md"
              />
              
              {/* Hover Image */}
              <Image
                width={300}
                height={300}
                src={agent.imageUrl1}
                alt={`${agent.name} portrait`}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[200px] object-contain opacity-0 translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 z-10 group-hover:scale-[200%]"
              />
            </div>

            <div className="bg-zinc-800 backdrop-blur-sm p-6 flex-1">
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
                className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors duration-300"
              >
                Start Chat
                <MessageCircle className='ml-2'/>
              </Link>
            </div>
          </div>
    );
}

