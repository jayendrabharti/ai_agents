import { useState, useCallback } from 'react';

export function useChat() {
    const [messages, setMessages] = useState([]);

    const addMessage = useCallback((content, sender) => {
        const newMessage = {
            id: Date.now().toString(),
            content,
            sender,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
    }, []);

    return { messages, setMessages, addMessage };
}
