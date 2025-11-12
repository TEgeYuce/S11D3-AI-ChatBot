import { useState, useRef, useEffect } from 'react';

import './App.css';
import { Chatbot } from './components/Chatbot';
import User from './components/User';
import { useGemini } from './hooks/useGemini';

function App() {
  const [userInput, setUserInput] = useState('');
  const { messages, isLoading, sendMessage } = useGemini();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function handleChat(event) {
    event.preventDefault();
    if (!userInput.trim()) return;

    sendMessage(userInput);
    setUserInput('');
  }

  function handleChange(event) {
    const { value } = event.target;
    setUserInput(value);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
      <div className=" bottom-[calc(4rem+1.5rem)] right-0 m-auto bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]">
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
          <p className="text-sm text-[#6b7280] leading-3">Powered by Gemini</p>
        </div>

        <div
          className="pr-4 h-[474px]"
          style={{ minWidth: '100%', display: 'table' }}
        >
          <div className="max-h-[454px] overflow-auto" ref={chatContainerRef}>
            {messages.map((msg, index) =>
              msg.role === 'user' ? (
                <User key={index} text={msg.text} />
              ) : (
                <Chatbot key={index} text={msg.text} />
              )
            )}
            {isLoading && (
              <Chatbot text="Yazıyor..." />
            )}
          </div>
        </div>
        <div className="flex items-center pt-0">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleChat}>
            <input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder={isLoading ? "Yanıt bekleniyor..." : "Message Gemini"}
              value={userInput}
              onChange={handleChange}
              disabled={isLoading}
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
              type="submit"
              disabled={isLoading || !userInput.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
