"use client";

import { Howl } from "howler";
import { playTextToSpeechServer } from "@/actions/playTextToAudio";

export async function playTextToSpeech(text,useLipSync) {
  try {

    const {audioContent, lipSyncData} = await playTextToSpeechServer(text,useLipSync);

    if (!audioContent) {
      throw new Error("No audio content received");
    }

    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
      { type: "audio/mp3" }
    );
    const audioUrl = URL.createObjectURL(audioBlob);

    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      onload: () => console.log("Sound loaded"),
      onend: () => {
        console.log("Sound finished");
        URL.revokeObjectURL(audioUrl);
      },
      onerror: (error) => console.error("Howler.js error:", error),
    });

    return { sound, lipSyncData};

  } catch (err) {
    console.error("Error playing TTS:", err.message);
  }
}