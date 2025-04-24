import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        const handleSlashKey = (e) => {
            if (e.key === '/') {
                e.preventDefault();
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleSlashKey);
        return () => {
            window.removeEventListener('keydown', handleSlashKey);
        };
    }, []);

    return (
        <div className="flex items-center gap-2 bg-zinc-900 p-4 border-t border-gray-700">
            <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Click [/] to type message"
                className="flex-1 p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white placeholder-gray-400"
            />
            <button
                onClick={handleSend}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
            >
                <Send size={20} />
            </button>
        </div>
    );
}
