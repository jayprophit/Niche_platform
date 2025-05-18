import { Server } from 'socket.io';
import { createServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

let io: Server;

export default function realtimeHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log('*First use, starting Socket.io');
    
    const httpServer = createServer();
    io = new Server(httpServer, {
      path: '/api/socket',
      cors: {
        origin: '*',
      },
    });
    
    // Listen for connection
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });
    
    // Store io instance to reuse
    res.socket.server.io = io;
  }
  
  res.end();
}

// Export function to emit events from anywhere
export function emitSocialEvent(event: string, data?: any) {
  if (io) {
    io.emit(event, data);
  }
}
