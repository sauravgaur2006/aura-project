import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { detectFace, loadModels } from '@/lib/face-analysis';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraOff, Play, Square, AlertCircle, CheckCircle2, Brain } from 'lucide-react';

const StudyMode = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [status, setStatus] = useState('initializing'); // initializing, ready, away, drowsy, distracted, focused
  const [score, setScore] = useState(100);
  const [timer, setTimer] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [events, setEvents] = useState([]);
  
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await loadModels();
      setStatus('ready');
    };
    init();
    return () => {
      stopSession();
    };
  }, []);

  useEffect(() => {
    let t;
    if (isStarted) {
      t = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isStarted]);

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const { data } = await api.post('/sessions/start');
      setSessionId(data._id);
      setIsStarted(true);
      
      intervalRef.current = setInterval(async () => {
        if (videoRef.current) {
          const result = await detectFace(videoRef.current);
          setStatus(result.status);
          
          // Add event if status changed
          setEvents(prev => [...prev, { type: result.status, duration: 1, timestamp: new Date() }]);
          
          // Update score
          setScore(prev => {
            let penalty = 0;
            if (result.status === 'away') penalty = 1.5;
            if (result.status === 'drowsy') penalty = 2;
            if (result.status === 'distracted') penalty = 1;
            return Math.max(0, Math.min(100, prev - (penalty / 60))); // Decay over a minute
          });
        }
      }, 1000);
      
      toast.success('Focus session started!');
    } catch (error) {
      toast.error('Could not access camera');
    }
  };

  const stopSession = async () => {
    if (!isStarted) return;
    
    clearInterval(intervalRef.current);
    setIsStarted(false);
    
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    try {
      await api.post('/sessions/end', {
        sessionId,
        focusScoreAvg: Math.round(score),
        events
      });
      toast.success('Session saved!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save session');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'focused': return 'text-emerald-500';
      case 'distracted': return 'text-amber-500';
      case 'away': return 'text-red-500';
      case 'drowsy': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getNudge = () => {
    if (status === 'away') return "Hey, where did you go? 👀";
    if (status === 'drowsy') return "You look tired, take a break? ☕";
    if (status === 'distracted') return "Stay focused, you got this! 🔥";
    if (status === 'focused') return "Great focus! Keep going 🚀";
    return "Initializing camera...";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto pt-24 pb-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-1 w-full space-y-6">
            <Card className="overflow-hidden bg-black aspect-video relative rounded-2xl border-2 border-primary/20">
              {isStarted ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <CameraOff size={64} className="opacity-20" />
                  <p>Camera is off</p>
                </div>
              )}
              
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isStarted ? 'bg-red-500' : 'bg-gray-500'}`} />
                <span className="text-sm font-mono font-bold text-white">{formatTime(timer)}</span>
              </div>

              {isStarted && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-primary/20 ${getStatusColor()}`}>
                      {status === 'focused' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                      <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Current Status</p>
                      <p className={`text-lg font-bold capitalize ${getStatusColor()}`}>{status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Focus Score</p>
                    <p className="text-2xl font-black text-white">{Math.round(score)}%</p>
                  </div>
                </div>
              )}
            </Card>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
              <p className="text-xl font-medium italic text-primary/80">"{getNudge()}"</p>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Study Controls</h3>
                  <p className="text-sm text-muted-foreground">The Focus Coach AI will monitor your attention in real-time.</p>
                </div>
                
                {!isStarted ? (
                  <Button onClick={startSession} size="lg" className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                    <Play className="mr-2 h-6 w-6" /> Start Focus
                  </Button>
                ) : (
                  <Button onClick={stopSession} variant="destructive" size="lg" className="w-full py-8 text-xl font-bold shadow-xl shadow-destructive/20">
                    <Square className="mr-2 h-6 w-6" /> End Session
                  </Button>
                )}

                <div className="pt-4 space-y-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Eye tracking active</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Head pose detection ready</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Privacy mode enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-indigo-400" /> Privacy Note
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ScholarOS uses client-side AI detection. Your video feed never leaves your local browser. Only focus metadata is stored for your analytics.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyMode;
