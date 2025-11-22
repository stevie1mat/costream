import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '../services/socket';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
};

interface WebRTCProps {
  roomId: string;
  isHost: boolean;
}

export const useWebRTC = ({ roomId, isHost }: WebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  // To handle audio mixing (Mic + System Audio)
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sysSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Initialize Media
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      return null;
    }
  }, []);

  // Create Peer Connection
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', {
          roomId,
          type: 'candidate',
          payload: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case 'connected':
          setConnectionStatus('connected');
          break;
        case 'failed':
        case 'disconnected':
        case 'closed':
          setConnectionStatus('failed');
          break;
        default:
          setConnectionStatus('connecting');
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [roomId]);

  // Setup Socket Listeners
  useEffect(() => {
    const pc = createPeerConnection();

    const handleSignal = async (data: any) => {
      if (!pc) return;

      try {
        if (data.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
          // Always add local tracks before answering (prevents missing remote stream)
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
              pc.addTrack(track, localStreamRef.current!);
            });
          }
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('signal', { roomId, type: 'answer', payload: answer });
        } else if (data.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
        } else if (data.type === 'candidate') {
          await pc.addIceCandidate(new RTCIceCandidate(data.payload));
        } else if (data.type === 'user-connected' && isHost) {
          // I am host, someone joined, I initiate offer
          // Ensure we have media before offering
          if (!localStreamRef.current) {
             await initLocalStream();
          }
          
          // Add tracks
          if (localStreamRef.current) {
             localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current!);
             });
          }

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('signal', { roomId, type: 'offer', payload: offer });
        }
      } catch (err) {
        console.error('Signaling Error:', err);
      }
    };

    socket.on('signal', handleSignal);
    socket.on('user-connected', (userId) => {
       console.log('User connected:', userId);
       handleSignal({ type: 'user-connected' });
    });

    return () => {
      socket.off('signal');
      socket.off('user-connected');
    };
  }, [roomId, isHost, createPeerConnection, initLocalStream]);

  // Screen Sharing Logic with Audio Mixing
  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true // Important for system audio
      });

      const pc = peerConnectionRef.current;
      if (!pc || !localStreamRef.current) return;

      const screenVideoTrack = displayStream.getVideoTracks()[0];
      const screenAudioTrack = displayStream.getAudioTracks()[0];
      const senders = pc.getSenders();
      
      // 1. Replace Video Track
      const videoSender = senders.find(s => s.track?.kind === 'video');
      if (videoSender) {
        videoSender.replaceTrack(screenVideoTrack);
      }

      // 2. Mix Audio (Mic + System) if system audio exists
      if (screenAudioTrack) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const dest = audioCtx.createMediaStreamDestination();
        audioDestinationRef.current = dest;

        // Mic Source
        const micTrack = localStreamRef.current.getAudioTracks()[0];
        if (micTrack) {
          const micStream = new MediaStream([micTrack]);
          const micSource = audioCtx.createMediaStreamSource(micStream);
          micSource.connect(dest);
          micSourceRef.current = micSource;
        }

        // System Audio Source
        const sysStream = new MediaStream([screenAudioTrack]);
        const sysSource = audioCtx.createMediaStreamSource(sysStream);
        sysSource.connect(dest);
        sysSourceRef.current = sysSource;

        // Replace Audio Sender with Mixed Track
        const mixedAudioTrack = dest.stream.getAudioTracks()[0];
        const audioSender = senders.find(s => s.track?.kind === 'audio');
        if (audioSender) {
          audioSender.replaceTrack(mixedAudioTrack);
        }
      }

      setIsScreenSharing(true);

      // Handle Stop Sharing (via Browser UI)
      screenVideoTrack.onended = () => {
        stopScreenShare();
      };

    } catch (err) {
      console.error("Failed to share screen", err);
    }
  };

  const stopScreenShare = () => {
    const pc = peerConnectionRef.current;
    if (!pc || !localStreamRef.current) return;

    const senders = pc.getSenders();

    // Revert Video
    const localVideoTrack = localStreamRef.current.getVideoTracks()[0];
    const videoSender = senders.find(s => s.track?.kind === 'video');
    if (videoSender && localVideoTrack) {
      videoSender.replaceTrack(localVideoTrack);
    }

    // Revert Audio
    const localAudioTrack = localStreamRef.current.getAudioTracks()[0];
    const audioSender = senders.find(s => s.track?.kind === 'audio');
    if (audioSender && localAudioTrack) {
      audioSender.replaceTrack(localAudioTrack);
    }

    // Cleanup Audio Context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsScreenSharing(false);
  };

  const toggleMic = () => {
     if (localStreamRef.current) {
        const track = localStreamRef.current.getAudioTracks()[0];
        track.enabled = !track.enabled;
        // Force update to trigger re-renders if needed (though stream obj is same)
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
     }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
       const track = localStreamRef.current.getVideoTracks()[0];
       track.enabled = !track.enabled;
       setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
    }
  };

  useEffect(() => {
     initLocalStream();
     // Cleanup on unmount
     return () => {
        if (localStreamRef.current) {
           localStreamRef.current.getTracks().forEach(t => t.stop());
        }
        if (peerConnectionRef.current) {
           peerConnectionRef.current.close();
        }
     }
  }, [initLocalStream]);

  return {
    localStream,
    remoteStream,
    connectionStatus,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    toggleMic,
    toggleCamera
  };
};
