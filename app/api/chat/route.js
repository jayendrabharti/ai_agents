import {GoogleGenerativeAI} from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Chat from "@/models/chat";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

export async function GET(request) {
    try {

        await connectToDB();

        const session = await getServerSession(authOptions);

        if(!session){
          return NextResponse.json({ error: 'User not logged In !!' }, { status: 500 });
        }

        const user = await User.findOne({ email: session.user.email });
        const chat = await Chat.find({ agentName: 'lawyer', user: user._id });
        const chatHistory = chat.flatMap(chat => chat.messages || []);
        // console.log('History', chatHistory);

        const url = new URL(request.url);
        const prompt = Object.fromEntries(url.searchParams.entries()).prompt;
        
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });


        const chatSession = model.startChat({
            generationConfig,
            history: [
              ...chatHistory
            ],
        });

        const result = await chatSession.sendMessage(prompt);
        const text = result.response.text();
        const data = { message: text , history: await chatSession.getHistory()};

        return NextResponse.json(data);

    } catch (error) {
      console.log(error)
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}