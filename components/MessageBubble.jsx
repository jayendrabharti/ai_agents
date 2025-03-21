import React from 'react';
import Markdown from 'react-markdown';

export function MessageBubble({ message }) {
    const isUser = message.sender === 'user';
    const bubbleClass = isUser
        ? 'bg-white text-black ml-auto'
        : 'bg-[#333] text-[#ccc] mr-auto';

    return (
        <div 
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}
        >
            <div
                className={`rounded-xl px-4 py-2 max-w-[70%] break-words ${bubbleClass}`}
            >
                <Markdown>{message.content}</Markdown>
            </div>
            <span className="text-xs text-gray-500 mt-1">
                {message.sender=="user"?"You":"Assistant"} • {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </span>
        </div>
    );
}
