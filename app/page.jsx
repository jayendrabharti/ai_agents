"use client";
import { Sparkles } from "lucide-react";
import { agentsList } from "@/agents/agents";
import AgentCard from "@/components/AgentCard";
import AgentCard2 from "@/components/AgentCard2";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto h-full p-3">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-4 flex items-center justify-center gap-2">
            Meet Our AI Agents
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our collection of specialized AI agents, each designed to assist you in unique ways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {agentsList.map((agent,index) => (
            <AgentCard2 key={index} agent={agent}/>
            // <AgentCard key={index} agent={agent}/>
          ))}
        </div>
          
      </main>
  );
}
