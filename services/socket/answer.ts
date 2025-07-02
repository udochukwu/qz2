import { useCallback } from 'react';
import { API } from '../../API';
import { Socket, io } from 'socket.io-client';

type AnswerStream = {
  request_id: string;
}

export const emitAnswerStream = (socket: Socket, request_id: string) => {
  const payload: AnswerStream = { request_id };
  socket.emit("answer_stream_v2", payload);
}

export const onAnswerStreamResponse = (socket: Socket, callback: (token: string) => void) => {
  socket.on("answer_stream_response", callback);
}

export const offAnswerStreamResponse = (socket: Socket, callback: (token: string) => void) => {
  socket.off("answer_stream_response", callback);
}
