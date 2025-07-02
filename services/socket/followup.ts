import { Socket } from "socket.io-client";

export type FollowupResponse = {
  followup_id: string;
  token: string;
  close?: boolean;
}

export type SuggestedFollowups = {
  suggested_follow_ups: string[];
}

export const onFollowupResponse = (socket: Socket, callback: (data: FollowupResponse) => void) => {
  socket.on("followup_response", callback);
}

export const offFollowupResponse = (socket: Socket, callback: (data: FollowupResponse) => void) => {
  socket.off("followup_response", callback);
}

export const emitFollowupStream = (socket: Socket, followupId: string) => {
  socket.emit("followup_stream", { followup_id: followupId });
}

export const onSuggestedFollowupResponse = (socket: Socket, callback: (data: SuggestedFollowups) => void) => {
  socket.on("suggested_follow_ups", callback);
}

export const offSuggestedFollowupResponse = (socket: Socket, callback: (data: SuggestedFollowups) => void) => {
  socket.off("suggested_follow_ups", callback);
}
