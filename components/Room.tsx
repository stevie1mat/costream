import React, { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { Controls } from './Controls';
import { Copy, Check, Loader2, Info, VideoOff } from 'lucide-react';

interface RoomProps {
  roomId: string;
  isHost: boolean;
  onLeave: () => void;
}

export const Room: React.FC<RoomProps> = ({ roomId, isHost, onLeave }) => {
  const {
    localStream,
    remoteStream,
    connectionStatus,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    toggleMic,
    toggleCamera
  } = useWebRTC({ roomId, isHost });

  const [localVideoRef, setLocalVideoRef] = useState<HTMLVideoElement | null>(null);
  const [remoteVideoRef, setRemoteVideoRef] = useState<HTMLVideoElement | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Auto-hide controls
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setControlsVisible(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef && localStream) {
      localVideoRef.srcObject = localStream;
    }
  }, [localVideoRef, localStream]);

  useEffect(() => {
    if (remoteVideoRef && remoteStream) {
      remoteVideoRef.srcObject = remoteStream;
    }
  }, [remoteVideoRef, remoteStream]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };
  
  const handleToggleMic = () => {
    toggleMic();
    setIsMuted(!isMuted);
  };
  
  const handleToggleCam = () => {
    toggleCamera();
    setIsCameraOff(!isCameraOff);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Top Bar (Info) */}
      <div className={`absolute top-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ${controlsVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-between items-start">
           <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
             <div>
               <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Room ID</p>
               <p className="text-lg font-mono font-bold text-white tracking-widest">{roomId}</p>
             </div>
             <button onClick={copyRoomId} className="p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white">
               {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
             </button>
           </div>
           
           {isScreenSharing && (
             <div className="bg-red-600/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
               <div className="w-2 h-2 bg-white rounded-full" />
               <span className="text-xs font-bold text-white uppercase tracking-wider">On Air</span>
             </div>
           )}
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 relative flex items-center justify-center">
        {connectionStatus === 'connecting' || connectionStatus === 'idle' ? (
          <div className="text-center space-y-4">
             <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto" />
             <p className="text-zinc-500 animate-pulse">Waiting for partner to join...</p>
             <p className="text-xs text-zinc-600 max-w-xs mx-auto">Share the Room ID with your friend. Ensure the signaling server is running.</p>
          </div>
        ) : (
          /* When connected, the main view depends on who is sharing screen */
          /* If remote is sharing, they are big. If I am sharing, I am big (to confirm what I show) */
          /* Otherwise, standard video chat 50/50 or PiP? Let's do PiP style for cinema */
          <div className="relative w-full h-full flex items-center justify-center p-4">
             {/* THEATER VIEW (Remote Stream - usually the movie) */}
             <div className="w-full h-full max-w-[90%] max-h-[90%] relative rounded-xl overflow-hidden shadow-2xl bg-zinc-900 ring-1 ring-zinc-800">
                <video
                  ref={setRemoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
                {!remoteStream && (
                   <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                     <p>Remote video paused</p>
                   </div>
                )}
             </div>

             {/* PiP VIEW (Local Stream - My Face) */}
             <div className="absolute bottom-8 right-8 w-48 aspect-video bg-zinc-900 rounded-lg overflow-hidden shadow-2xl ring-2 ring-zinc-800 hover:ring-zinc-600 transition-all cursor-move z-40 group">
                <video
                  ref={setLocalVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : ''}`}
                />
                {isCameraOff && (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                    <VideoOff size={24} />
                  </div>
                )}
                <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white/50 bg-black/50 px-1 rounded">YOU</div>
             </div>
          </div>
        )}
      </div>
      
      {/* Warning Toast for Audio */}
      {isScreenSharing && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-yellow-600/20 border border-yellow-600/50 text-yellow-200 px-4 py-2 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm pointer-events-none">
          <Info size={14} />
          Use headphones to prevent echo while sharing system audio.
        </div>
      )}

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-8 flex justify-center transition-transform duration-300 z-50 ${controlsVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <Controls 
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          isScreenSharing={isScreenSharing}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCam}
          onToggleScreenShare={handleToggleScreenShare}
          onLeave={onLeave}
        />
      </div>
    </div>
  );
};