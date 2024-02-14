import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoMdSend } from "react-icons/io";
import Markdown from "markdown-it";
import './MedicineAssistant.css'
import { BackgroundBeams } from '../UI/BackgroundBeam.tsx';
import { TracingBeam } from '../UI/TracingBeam.tsx';
import Starsvg from "../../Asset/BardStar.svg";

const genAI = new GoogleGenerativeAI(`AIzaSyB5v4JcdsO0gLlgPhSkPD6CZYefcWY7aHk`);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const md = new Markdown();

const MedicineAssistant = () => {
    const [newMessage, setNewMessage] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [modelAvatar, setModelAvatar] = useState('');
    const chatContainerRef = useRef(null);
    const [history, setHistory] = useState([
        {
            role: "user",
            parts: "Hello, You need to act like a Medicine Assistant.I may ask for what medicine I can take or ask for their dosage info and other related to medicines. If I ask you out of topic question simple give reply like Sorry I am just your  Medicine Assistant",
        },
        {
            role: "model",
            parts: "Great to meet you. How can I help you today?",
        },
    ]);

    useEffect(() => {
        fetchAvatar("user").then((avatarUrl) => setUserAvatar(avatarUrl));
        fetchAvatar("model").then((avatarUrl) => setModelAvatar(avatarUrl));
    }, []);

    async function fetchAvatar(role) {
        const response = await fetch(
            `https://source.unsplash.com/random/100x100/?${role}`
        );
        return response.url;
    }

    async function getResponse(prompt) {
        const chat = await model.startChat({ history: history });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!newMessage.trim()) {
            return;
        }

        const userRole = {
            role: "user",
            parts: newMessage,
        };

        const modelOutput = await getResponse(newMessage);
        const modelRole = {
            role: "model",
            parts: modelOutput,
        };

        setHistory([...history, userRole, modelRole]);
        setNewMessage("");
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const parseMessage = (message) => {
        // Check if the message is in pointwise format
        if (message.startsWith("- ")) {
            // Split the message into individual points
            const points = message.split("- ").filter(Boolean);

            // Create a list using Markdown for each point
            const listItems = points
                .map((point, index) => `- ${md.renderInline(point.trim())}`)
                .join("\n");

            return `<ul>${listItems}</ul>`;
        }

        // Check if the message is in tabular format
        if (message.includes("|")) {
            // Split the message into rows
            const rows = message.split("\n").map((row) => row.trim());

            // Parse each row into a table row
            const tableRows = rows
                .map((row) => {
                    const columns = row
                        .split("|")
                        .filter(Boolean)
                        .map((column) => column.trim());
                    return `<tr>${columns
                        .map((column) => `<td>${md.renderInline(column)}</td>`)
                        .join("")}</tr>`;
                })
                .join("");

            return `<table>${tableRows}</table>`;
        }

        // If no specific format is detected, render the message as usual
        return md.render(message);
    };

    return (
        <div className="h-full min-h-[100vh] w-full rounded-md bg-neutral-950 flex flex-col items-center justify-center antialiased">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold uppercase tracking-[1px] mb-[4%]">
                    Pharmos
                </h1>
                <p className="text-neutral-500 max-w-lg mx-auto my-1 text-lg text-center tracking-[1px] font-ai">
                    Welcome to <span className='uppercase font-bold floating-animation gemini-font'>Pharmos</span>, your personalized Medicine Assistant. We specialize in providing support and guidance for individuals seeking assistance with medication management. Whether you're in need of dosage information, guidance on medication timing, or advice for all age groups, <span className='uppercase font-bold floating-animation gemini-font'>Pharmos</span> is here for you every step of the way. The name Pharmos represents our commitment to pharmacy and personalized care.
                </p>



                <TracingBeam containerRef={chatContainerRef}>
                    <div className='w-7xl flex flex-col gap-x-2 border border-white rounded-[30px] overflow-hidden p-12 mt-[5%]'>
                        <div className='flex gap-x-2 mx-auto'>
                            <h1 className="text-2xl md:text-6xl text-white font-bold tracking-wider mb-4 text-center first-letter:capitalize chat-name font-ai">Hello, Hindol</h1>
                            <img src={Starsvg} alt='Star SVG' className='h-6 w-6 animated-star' />
                        </div>
                        <h1 className="text-2xl md:text-5xl text-gray-600 font-bold tracking-wider mb-4 text-center first-letter:capitalize font-ai">How can I help you today?</h1>
                        <div className="chat-container max-h-[300px] overflow-y-auto mt-[2%]" ref={chatContainerRef}>

                            {history.slice(1).map((message, index) => (
                                <div key={index} className={`flex place-items-center items-start space-x-2 ${message.role === "model" ? "justify-start" : "justify-end"}`}>
                                    {
                                        message.role === "user" ? <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full" /> : <img src={modelAvatar} alt="Model Avatar" className="w-10 h-10 rounded-full" />
                                    }
                                    <div className={`bg-black p-4 rounded-[15px] max-w-[50%] tracking-[2px] ${message.role === "user" ? "text-white" : "text-white"} max-w-xl break-words`} dangerouslySetInnerHTML={{ __html: message.role === "model" && history.length > 2 && index === history.length - 2 ? message.parts : parseMessage(message.parts) }} />
                                </div>
                            ))}



                        </div>
                        <form onSubmit={handleSubmit} className='w-full flex place-items-center justify-center mt-[4%] gap-x-2'>
                            <input type="text" value={newMessage} className='rounded-[15px] w-full p-4 bg-black border border-neutral-500 placeholder:tracking-[1px] placeholder:font-ai text-white font-ai text-2xl' placeholder='Enter your message' onChange={(e) => setNewMessage(e.target.value)} />
                            <IoMdSend className='text-neutral-300 cursor-pointer' size={40} color='' onClick={handleSubmit} />
                        </form>

                    </div>
                </TracingBeam>
            </div>
        </div >
    );


}

export default MedicineAssistant;