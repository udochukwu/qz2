import { Socket } from "socket.io-client";

export const onNewStepResponse = (socket: Socket, callback: (step_num: number) => void) => {
  socket.on("steps_new_step_response", callback)
};

export const offNewStepResponse = (socket: Socket, callback: (step_num: number) => void) => {
  socket.off("steps_new_step_response", callback)
};

export const onStepResponse = (socket: Socket, callback: (token: string) => void) => {
  socket.on("steps_answer_response", callback)
};

export const offStepResponse = (socket: Socket, callback: (token: string) => void) => {
  socket.off("steps_answer_response", callback)
};
