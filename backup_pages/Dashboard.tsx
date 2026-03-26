import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, Flame, Target, Trophy, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ totalHours: 0, avgFocus: 0 });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get('/sessions');
        setSessions(data);
        
        const totalMinutes = data.reduce((acc, s) => {
          if (!s.endTime) return acc;
          return acc + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000;
        }, 0);
        
        const avgFocus = data.length > 0 
          ? data.reduce((acc, s) => acc + (s.focusScoreAvg || 0), 0) / data.length 
          : 0;
          
        setStats({ 
          totalHours: Number((totalMinutes / 60).toFixed(1)), 
          avgFocus: Math.round(avgFocus) 
        });
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
    };
    fetchSessions();
  }, []);

  const chartData = sessions.slice().reverse().map(s => ({
    name: new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: s.focusScoreAvg
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground mt-1">Ready for another focused study session?</p>
          </div>
          <Link to="/study">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <Brain className="mr-2 h-5 w-5" /> Start Session
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}h</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Focus</CardTitle>
              <Target className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgFocus}%</div>
              <p className="text-xs text-muted-foreground mt-1">Great consistency!</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Focus Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.streak || 0} Days</div>
              <p className="text-xs text-muted-foreground mt-1">Keep it up! 🔥</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
              <Trophy className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.points || 0} XP</div>
              <p className="text-xs text-muted-foreground mt-1">Redeem for goodies</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Focus Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length > 0 ? sessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{new Date(s.startTime).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000)} min session
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{s.focusScoreAvg}%</div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Focus</div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-8">No sessions yet. Start studying!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
