import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, User, Bot, Loader2 } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/chat/history');
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chat', { message: input });
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 container mx-auto pt-24 pb-6 px-4 flex flex-col max-w-4xl">
        <Card className="flex-1 flex flex-col overflow-hidden border-2 border-primary/10 shadow-xl">
          <CardHeader className="border-b bg-primary/5 flex flex-row items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <Brain size={24} />
            </div>
            <div>
              <CardTitle className="text-xl">Focus Coach AI</CardTitle>
              <p className="text-xs text-muted-foreground font-medium">Your personal study & productivity assistant</p>
            </div>
          </CardHeader>
          
          <div className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-10 space-y-4">
                    <div className="inline-block p-4 bg-primary/10 rounded-full text-primary mb-2">
                       <Bot size={40} />
                    </div>
                    <h3 className="text-xl font-bold">Hello! I'm your Focus Coach.</h3>
                    <p className="text-muted-foreground px-10">Ask me anything about study techniques, academic doubts, or how to stay focused.</p>
                  </div>
                )}
                
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border'}`}>
                        {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted border rounded-tl-none'}`}>
                        <p className="text-sm leading-relaxed">{m.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="p-4 rounded-2xl bg-muted border rounded-tl-none flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm font-medium italic">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </div>

          <form onSubmit={handleSend} className="p-4 border-t bg-muted/30 flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask for study tips, solve a doubt..." 
              className="flex-1 bg-background"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Chatbot;
