import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000', {
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
};
