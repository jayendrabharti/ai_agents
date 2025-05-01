'use server';

import fs from 'fs/promises';
import path from 'path';
// import { GenerateLipSync } from '@/rhubarb/GenerateLipSync';
import axios from 'axios';

export async function playTextToSpeechServer(text,useLipSync) {
    const api_key = process.env.GOOGLE_TTS_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${api_key}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: "en-IN", name: "en-IN-Wavenet-F" },
            audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 16000 }, // Request WAV format
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `Text-to-Speech API error: ${response.status} - ${
                errorData.error?.message || response.statusText
            }`
        );
    }

    const data = await response.json();
    const audioBase64 = data.audioContent;
    if (!audioBase64) throw new Error("No audio content received");

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const filename = `speech.wav`; // Save as .wav
    const filePath = path.join(process.cwd(), 'rhubarb', filename);
    
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, audioBuffer);





    const GenerateLipSyncData = async()=>{
        try{

            const response = await axios.post(`${process.env.LIP_SYNC_API}/getlipsync`, 
                JSON.stringify({audioBase64: audioBase64}),
                {headers: {'Content-Type': 'application/json'}
            });

            return response.data;
        
        }catch(error){
            console.error("Error generating lip sync data: ", error);
        };      
    };

    const lipSyncData = useLipSync ? await GenerateLipSyncData() : null;
    // const lipSyncData = useLipSync ? await GenerateLipSync() : null;

    return { audioContent: audioBase64, lipSyncData: lipSyncData };
}