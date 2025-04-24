import { LoaderCircle, MessageCircle, Trash2 } from 'lucide-react';

export function ChatHeader({agentData,clearChat,messages,clearing,deleteDisabled}) {
  return (
    <div className="bg-zinc-900 border-b border-gray-700 p-4 flex items-center gap-3">
    
      <div className="p-2 bg-sky-700 rounded-full text-white">
        <MessageCircle size={24} />
      </div>
    
      <div>
        <h1 className="text-xl text-white font-semibold">{agentData.name} ({agentData.role})</h1>
        <p className="text-sm text-gray-400">Online</p>
      </div>
      
      <div className='ml-auto'>
          <button
            onClick={clearChat}
            className={`flex flex-row items-center gap-2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200 active:scale-90 ${deleteDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={deleteDisabled}
          >
            {clearing ? <LoaderCircle className='animate-spin'/> : <Trash2/>}
            {clearing ? "Clearing chat" : "Clear Chat"}
          </button>    
      </div>
    
    </div>
  );
}