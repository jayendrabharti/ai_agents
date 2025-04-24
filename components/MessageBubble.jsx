import { formatTimestamp } from '@/utils/common';
import React from 'react';
import Markdown from 'react-markdown';

export function MessageBubble({agentName, speaking,ref, message }) {
    const isUser = message.sender === 'user';
    const bubbleClass = isUser
        ? 'bg-zinc-50 text-black ml-auto'
        : 'bg-zinc-900 text-[#ccc] mr-auto';

    return (
        <div 
            ref={ref}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}
        >
            <div
                className={`rounded-xl px-4 py-2 max-w-[70%] break-words ${bubbleClass}`}
            >
                <Markdown>{message.content}</Markdown>
            </div>
            <span className="text-xs text-gray-400 mt-1">
                {message.sender == "user" ? "You" : agentName}
                {speaking && <span className='ml-2 text-white'> Speaking...</span>}
            </span>
        </div>
    );
}
