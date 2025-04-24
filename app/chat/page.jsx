import Link from "next/link";

export default function ChatPage() {
    return(
        <div className="text-center flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-4 flex items-center justify-center gap-2">Chat</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Select an AI agents.</p>
            <Link href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">Go to Agents</Link>
        </div>
    )
}