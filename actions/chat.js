"use server";
import {GoogleGenerativeAI} from "@google/generative-ai";
import agents from "@/agents/agents";
import Users from '@/models/user';
import Chats from '@/models/chat';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/utils/database';
import { authOptions } from '@/utils/authOptions';

const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 500,
    responseMimeType: "text/plain",
  };

export async function SendAndGetMessage(agentName, message) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("User not authenticated.");
      return JSON.stringify({ error: "User not authenticated." });
    }
    
    let chatHistory = [];
    
    const existingChat = await Chats.findOne({ user: session.user.id, agentName: agentName });
    
    if (existingChat?.chatHistory) {
      try {
        chatHistory = JSON.parse(existingChat.chatHistory);
      } catch (error) {
        console.error("Error parsing existing chat history:", error);
        chatHistory = [];
      }
    }
    
    const promptContents = [];
    
    const knowledgeBase = agents[agentName]?.knowledgeBase || null;
    if (knowledgeBase) {
      promptContents.push({ role: "user", parts: [{ text: message + `Knowledge Base:\n${knowledgeBase}` }] });
    }
    const firstName = session.user.name.split(' ')[0];
    promptContents.push({ role: "user", parts: [{ text: message + ` My name is ${firstName}` }] });

    chatHistory.forEach(chatTurn => {
      promptContents.push({ role: chatTurn.role, parts: chatTurn.parts });
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
    });

    const chatSession = model.startChat({
        generationConfig,
        history: promptContents,
    });

    const result = await chatSession.sendMessage(message);
    const text = result.response.text();

    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text: text }] }); // Ensure 'parts' is an array of objects

    const updatedChatHistoryString = JSON.stringify(chatHistory);

    if (existingChat) {
      await Chats.findByIdAndUpdate(existingChat._id, { chatHistory: updatedChatHistoryString });
    } else {
      await Chats.create({
        user: session.user.id,
        agentName: agentName,
        chatHistory: updatedChatHistoryString,
      });
    }

    return JSON.stringify({ message: text });
  } catch (error) {
    console.error("Error in SendAndGetMessage:", error);
    return JSON.stringify({ error: "Failed to get, process, or save message." });
  }
}

export async function GetChat(agentName) {
  try{
      await connectToDB();
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        console.error("User not authenticated.");
        return JSON.stringify({ error: "User not authenticated." });
      }

      const chat = await Chats.findOne({ user: session.user.id, agentName: agentName });

      return JSON.stringify({chatHistory: chat?.chatHistory || "[]"});

  }catch(error){
      console.error("Error in GetMessages:", error);
      return JSON.stringify({ error: "Failed to get Chat." });
  }
}
export async function ClearChat(agentName) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error("User not authenticated.");
      return JSON.stringify({ success: false });
    }

    const chat = await Chats.findOneAndDelete({ user: session.user.id, agentName: agentName });

    return JSON.stringify({ success: !!chat }); // Return success:true if chat was deleted, otherwise success:false

  } catch (error) {
    console.error("Error in ClearChat:", error);
    return JSON.stringify({ success: false });
  }
}
