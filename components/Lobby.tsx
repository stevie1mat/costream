import React, { useState } from 'react';
import { Film, Users, Play } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { connectSocket, socket } from '../services/socket';

interface LobbyProps {
  onJoin: (roomId: string, isHost: boolean) => void;
  embedded?: boolean;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoin, embedded = false }) => {
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState('');

  const createRoom = () => {
    connectSocket();
    const newRoomId = Math.floor(100000 + Math.random() * 900000).toString();
    socket.emit('join-room', newRoomId);
    onJoin(newRoomId, true);
  };

  const joinRoom = () => {
    if (joinId.length !== 6) {
      setError('Room ID must be a 6-digit code');
      return;
    }
    connectSocket();
    socket.emit('join-room', joinId);
    onJoin(joinId, false);
  };

  const containerClasses = embedded
    ? "w-full bg-black/40 border border-white/10 backdrop-blur-md rounded-3xl p-8"
    : "relative z-10 w-full max-w-md p-8 bg-black/60 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl";

  const wrapperClasses = embedded
    ? ""
    : "min-h-screen flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2079&auto=format&fit=crop')] bg-cover bg-center";

  return (
    <div className={wrapperClasses}>
      {!embedded && <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />}

      <div className={containerClasses}>
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-red-600 rounded-full bg-opacity-10 mb-4">
            <Film className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Co-Watch</h1>
          <p className="text-zinc-400 text-center">Watch movies together in perfect sync with high-quality audio sharing.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Button onClick={createRoom} className="w-full py-4 text-lg" size="lg">
              <Play className="w-5 h-5 mr-2 fill-current" />
              Create New Room
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 text-zinc-500 ${embedded ? 'bg-transparent' : 'bg-zinc-950'}`}>Or join existing</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter 6-digit Room ID"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center tracking-widest text-lg font-mono"
              />
              <Button onClick={joinRoom} variant="secondary" disabled={joinId.length !== 6}>
                Join
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-center gap-6 text-zinc-500 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Real-time Video</span>
          </div>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            <span>System Audio</span>
          </div>
        </div>
      </div>
    </div>
  );
};