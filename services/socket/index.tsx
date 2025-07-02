import { PropsWithChildren } from 'react';
import { io, Socket } from 'socket.io-client';
import { API } from '../../API';
import { getSessionId } from '../storage';
import { createContext, useContext } from 'react';
import * as Sentry from '@sentry/react-native';

const getConnectionHeaders = () => ({
  "x-access-tokens": getSessionId().session_token,
});

const TIMEOUT_DURATION = 7000;

export const backendSocket = io(API, { 
  autoConnect: false, 
  reconnection: false,
  transports: ['websocket'], 
  timeout: TIMEOUT_DURATION });

const connectBackendSocket = () => {
  if (!backendSocket.connected) {
    console.log("CONNECTING TO SOCKET...")
    backendSocket.auth = getConnectionHeaders();
    backendSocket.connect();

    if (!backendSocket.hasListeners('connect')) {
      backendSocket.on('connect', () => {
        console.log("socket connected");
      });
    }

    if (!backendSocket.hasListeners('disconnect')) {
      backendSocket.on('disconnect', () => {
        console.log("socket disconnected");
      });
    }

    if (!backendSocket.hasListeners('connect_error')) {
      backendSocket.on('connect_error', (err: any) => {
        console.log("socket failed to connect due to ", err);
        Sentry.captureException("Error connecting to socket: " + err);
      });
    }
  }
};

const disconnectBackendSocket = () => {
  if (backendSocket.connected) {
    backendSocket.disconnect();
  }
}

export type FollowupResponse = {
  followup_id: string;
  token: string;
  close?: boolean;
}

type SocketContextType = {
  socket: Socket;
  connect: () => void;
  disconnect: () => void;
}

const onAnswerStreamError = (socket: Socket, callback: (data: any) => void) => {
  socket.on("answer_stream_error", callback);
}
const offAnswerStreamError = (socket: Socket, callback: (data: any) => void) => {
  socket.off("answer_stream_error", callback);
}
const SocketContext = createContext<SocketContextType | null>(null);

const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within SocketContextProvider");
  }
  return context;
}

const SocketContextProvider = ({ children }: PropsWithChildren) => (
  <SocketContext.Provider
    value={{
      socket: backendSocket,
      connect: connectBackendSocket,
      disconnect: disconnectBackendSocket,
    }}
  >
    {children}
  </SocketContext.Provider>
)


export { useSocketContext, SocketContextProvider, onAnswerStreamError, offAnswerStreamError };
