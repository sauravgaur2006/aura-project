import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/Chat.js';

// #4: Zod schema for chat message validation
const sendMessageSchema = z.object({
  message: z.string().min(1).max(4000),
});

export const getChatHistory = async (req, res) => {
  try {
    const history = await Chat.findOne({ userId: req.user.id });
    res.json(history || { messages: [] });
  } catch (error) {
    // #7: Sanitize error messages
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    // #4: Validate input
    const { message } = sendMessageSchema.parse(req.body);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: 'You are ScholarOS, a helpful academic tutor and productivity coach for students. Provide study tips, academic help, and motivation.',
    });

    let chat = await Chat.findOne({ userId: req.user.id });

    if (!chat) {
      chat = new Chat({ userId: req.user.id, messages: [] });
    }

    const mapRole = (role) => role === 'assistant' ? 'model' : 'user';

    const history = chat.messages.map(m => ({
      role: mapRole(m.role),
      parts: [{ text: m.content }]
    }));

    const chatSession = model.startChat({ history });

    const userMessage = { role: 'user', content: message };
    chat.messages.push(userMessage);

    const result = await chatSession.sendMessage(message);
    const textResponse = result.response.text();

    const assistantMessage = { role: 'assistant', content: textResponse };
    chat.messages.push(assistantMessage);
    await chat.save();

    res.json({ message: assistantMessage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    // #7: Sanitize error messages
    console.error('Send message error:', error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
};
