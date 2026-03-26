import OpenAI from 'openai';
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
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let chat = await Chat.findOne({ userId: req.user.id });
    
    if (!chat) {
      chat = new Chat({ userId: req.user.id, messages: [] });
    }

    const userMessage = { role: 'user', content: message };
    chat.messages.push(userMessage);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are ScholarOS, a helpful academic tutor and productivity coach for students. Provide study tips, academic help, and motivation.' },
        ...chat.messages.map(m => ({ role: m.role, content: m.content }))
      ],
    });

    const assistantMessage = { role: 'assistant', content: response.choices[0].message.content };
    chat.messages.push(assistantMessage);
    await chat.save();

    res.json({ message: assistantMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
