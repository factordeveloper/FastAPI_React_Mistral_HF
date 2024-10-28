import React, { useState } from "react";
import axios from "axios";

function App() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");

    const handleSend = async () => {
        if (prompt.trim() === "") {
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

    return (
        <div className="app-container">
            <h1>Voice-powered Mistral Chatbot</h1>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your question here..."
            />
            <button onClick={handleSend}>Send</button>
            <div id="responseContainer">{response}</div>
        </div>
    );
}

export default App;
