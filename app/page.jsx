import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import AgentCard from "@/components/AgentCard";


export const agents = [
  {
    name: 'Harvey Spector',
    role: 'Lawyer',
    description: 'Experienced lawyer specializing in corporate law and litigation.',
    imageUrl1: '/api/media/lawyer1',
    imageUrl2: '/api/media/lawyer2',
    href: '/chat/lawyer'
  },
];


export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-4 flex items-center justify-center gap-2">
            Meet Our AI Agents
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of specialized AI agents, each designed to assist you in unique ways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent,index) => (
            <AgentCard key={index} agent={agent}/>
          ))}
        </div>
          
      </main>
  );
}
