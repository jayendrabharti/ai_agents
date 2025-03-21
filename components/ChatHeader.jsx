import { MessageCircle } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-3">
      <div className="p-2 bg-blue-600 rounded-full text-white">
        <MessageCircle size={24} />
      </div>
      <div>
        <h1 className="text-xl text-white font-semibold">Chat App</h1>
        <p className="text-sm text-gray-400">Online</p>
      </div>
    </div>
  );
}