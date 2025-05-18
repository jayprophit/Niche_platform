import { useEffect } from 'react';
import io from 'socket.io-client';

export function useFeedRealtime(onUpdate: () => void) {
  useEffect(() => {
    const socket = io(); // Assumes backend is set up
    
    socket.on('feedUpdate', onUpdate);
    
    return () => {
      socket.disconnect();
    };
  }, [onUpdate]);
}
