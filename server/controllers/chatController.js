import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/Chat.js';

export const getChatHistory = async (req, res) => {
  try {
    const history = await Chat.findOne({ userId: req.user.id });
    res.json(history || { messages: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { message } = req.body;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: 'You are ScholarOS, a helpful academic tutor and productivity coach for students. Provide study tips, academic help, and motivation.' });

    let chat = await Chat.findOne({ userId: req.user.id });
    
    if (!chat) {
      chat = new Chat({ userId: req.user.id, messages: [] });
    }

    const mapRole = (role) => role === 'assistant' ? 'model' : 'user';

    const history = chat.messages.map(m => ({
      role: mapRole(m.role),
      parts: [{ text: m.content }]
    }));

    const chatSession = model.startChat({
      history: history
    });

    const userMessage = { role: 'user', content: message };
    chat.messages.push(userMessage);

    const result = await chatSession.sendMessage(message);
    const textResponse = result.response.text();

    const assistantMessage = { role: 'assistant', content: textResponse };
    chat.messages.push(assistantMessage);
    await chat.save();

    res.json({ message: assistantMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
