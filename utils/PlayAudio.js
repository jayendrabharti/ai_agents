import { Howl } from "howler";


async function playTextToSpeech(text) {
    try {
      const api_key = toString(process.env.GOOGLE_TTS_API_KEY);
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyCAPo70jjxDI8YWCHEEtYAYXb-7et_iL0k`;
    // const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${api_key}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "en-IN", name: "en-IN-Wavenet-F" }, // Added language code to name
        audioConfig: {
          audioEncoding: "MP3",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Text-to-Speech API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.audioContent) {
      throw new Error("No audio content received from API.");
    }

    const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: "audio/mp3" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const sound = new Howl({
      src: [audioUrl],
      html5: true, // Important for larger files
      onload: () => {
        console.log("Sound loaded ",sound.duration())
      }, // Example: Handle loading state
      onend: () => {
        console.log("Sound finished");
        URL.revokeObjectURL(audioUrl); // Revoke after playback
      },
      onerror: (error) => console.error("Howler.js error:", error), // Handle Howler.js errors
    });

    return { data, sound, audioUrl };
  } catch (error) {
    console.error("Error in Text-to-Speech:", error);
    return { error: error.message }; // Return error details if needed
  }
}

export default playTextToSpeech;