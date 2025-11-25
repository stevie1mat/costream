import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Room } from './components/Room';
import { disconnectSocket } from './services/socket';

const App: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  const handleJoin = (id: string, host: boolean) => {
    setRoomId(id);
    setIsHost(host);
  };

  const handleLeave = () => {
    disconnectSocket();
    setRoomId(null);
    setIsHost(false);
  };

  if (!roomId) {
    return <LandingPage onJoin={handleJoin} />;
  }

  return <Room roomId={roomId} isHost={isHost} onLeave={handleLeave} />;
};

export default App;