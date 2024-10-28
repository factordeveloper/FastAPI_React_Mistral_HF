// App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [recordedText, setRecordedText] = useState("");

    // Speech Recognition
    const startRecording = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onstart = () => console.log("Voice recognition started.");
        recognition.onspeechend = () => recognition.stop();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setRecordedText(transcript);
            setPrompt(transcript);
        };
        recognition.start();
    };

    // Send prompt to backend
    const handleSend = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/chat/", { prompt });
            setResponse(res.data.response);
        } catch (error) {
            setResponse("Error: Unable to fetch response");
        }
    };

    // Text-to-Speech for response
    const speakResponse = () => {
        if (response) {
            const speech = new SpeechSynthesisUtterance(response);
            window.speechSynthesis.speak(speech);
        } else {
            alert("No response to speak.");
        }
    };

    return (
        <div className="app-container">
            <h1>Voice-powered Mistral Chatbot</h1>

            <button onClick={startRecording}>Start Recording</button>
            <p id="recorded-text">{recordedText}</p>

            <div className="input-container">
                <textarea
                    id="promptInput"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Or type your question here..."
                ></textarea>
                <button id="sendButton" onClick={handleSend}>Send</button>
            </div>

            <div id="responseContainer">{response}</div>

            <button id="speakResponseBtn" onClick={speakResponse}>Speak Response</button>
        </div>
    );
}

export default App;
