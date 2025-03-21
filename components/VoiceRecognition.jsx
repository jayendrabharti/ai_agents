import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Mic, MicOff } from "lucide-react";

const VoiceRecognition = ({ onSubmit }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);

    const setupRecognition = useCallback(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => setIsListening(true);

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                onSubmit(text);
            };

            recognition.onspeechend = () => {
                recognition.stop();
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Web Speech API is not supported in this browser.");
        }
    }, [onSubmit]);

    useEffect(() => {
        setupRecognition();
    }, [setupRecognition]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript("");
            recognitionRef.current?.start();
        }
    }, [isListening]);

    
    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.ctrlKey && event.key === 'v') {
                toggleListening();
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [toggleListening]);

    return (
        <>
        <div className="flex flex-col items-center space-y-3 absolute bottom-3 right-1/2 translate-x-1/2">
            <button
                onClick={toggleListening}
                className={`p-4 rounded-full text-white bg-opacity-50 ${
                    isListening ? "bg-red-500" : "bg-blue-500"
                }`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
            >
                {isListening ? <Mic className="size-10" /> : <MicOff className="size-10" />}
            </button>
        </div>
        {transcript && <p className="bg-black rounded-lg bg-opacity-70 p-2 text-lg text-white absolute top-2 left-1/2 -translate-x-1/2 ">{transcript}</p>}
        </>
    );
};

VoiceRecognition.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default VoiceRecognition;
