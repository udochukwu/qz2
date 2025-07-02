import { API } from "../../API";
import { getRequestHeaders, handleResponse, SuccessfulResponse } from "./common";
import { getTimeZone } from "react-native-localize";


type LoginResponse = {
  ok: boolean;
  tokens: number;
  login_info: {
    daily_tokens_claimable: number;
    user_id: string;
    session_token: string;
  }
}

export const userLoginV4 = async (): Promise<SuccessfulResponse<LoginResponse>> => {
  const response = await fetch(`${API}/v4/user/login`, {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify({timezone: getTimeZone()})
  });
  return await handleResponse<LoginResponse>(response);
}
