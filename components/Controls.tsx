import React from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, XSquare, PhoneOff } from 'lucide-react';

interface ControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isMuted,
  isCameraOff,
  isScreenSharing,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onLeave
}) => {
  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-zinc-900/90 backdrop-blur-md rounded-full border border-zinc-800 shadow-xl transition-all hover:bg-zinc-900">
      <button
        onClick={onToggleMic}
        className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      <button
        onClick={onToggleCamera}
        className={`p-3 rounded-full transition-all ${isCameraOff ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
        title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
      >
        {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      <button
        onClick={onToggleScreenShare}
        className={`p-3 rounded-full transition-all ${isScreenSharing ? 'bg-green-500/10 text-green-500 border border-green-500/50' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
        title="Share Screen"
      >
        {isScreenSharing ? <XSquare size={20} /> : <MonitorUp size={20} />}
      </button>

      <div className="w-px h-8 bg-zinc-700 mx-2" />

      <button
        onClick={onLeave}
        className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20"
        title="Leave Room"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
};