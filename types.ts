export interface RoomState {
  id: string;
  isHost: boolean;
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'candidate' | 'join' | 'user-connected' | 'user-disconnected';
  payload?: any;
  roomId?: string;
}

export interface PeerState {
  stream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoStopped: boolean;
  isScreenSharing: boolean;
}
