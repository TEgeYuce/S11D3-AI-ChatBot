import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash";

/**
 * @returns {{
 * messages: {role: 'user' | 'model', text: string}[],
 * isLoading: boolean,
 * sendMessage: (message: string) => Promise<void>
 * }}
 */
export const useGemini = () => {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Merhaba! Ben bir Gemini sohbet robotuyum. Nasıl yardımcı olabilirim?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState(null);

  if (!chat) {
    setChat(
      ai.chats.create({
        model,
        // İlk Mesaj
      })
    );
  }

  const sendMessage = async (message) => {
    if (!message.trim() || !chat) return;

    const newUserMessage = { role: 'user', text: message };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message });
      const responseText = response.text;
      
      const newModelMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, newModelMessage]);

    } catch (error) {
      console.error("Gemini API Hatası:", error);
      const errorMessage = "Üzgünüm, Gemini'a bağlanırken bir hata oluştu. Lütfen konsolu kontrol edin veya API anahtarınızı doğrulayın.";
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};