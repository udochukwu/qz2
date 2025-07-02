import { Socket } from "socket.io-client";

export type FinalOption = {
  selected_option_text: string[];
  selected_option_index: number[];
}

export const onFinalOption = (socket: Socket, callback: (finalOption: FinalOption) => void) => {
  socket.on("final_option_response", callback);
};

export const offFinalOption = (socket: Socket, callback: (finalOption: FinalOption) => void) => {
  socket.off("final_option_response", callback);
};

export type FinalAnswer = {
    answer_text: string;
}

export const onFinalAnswer = (socket: Socket, callback: (finalAnswer: FinalAnswer) => void) => {
  socket.on("final_answer_response", callback);
};

export const offFinalAnswer = (socket: Socket, callback: (finalAnswer: FinalAnswer) => void) => {
  socket.off("final_answer_response", callback);
};

export const isFinalAnswer = (finalResponse: FinalOption | FinalAnswer): finalResponse is FinalAnswer => {
  return 'answer_text' in finalResponse;
}
