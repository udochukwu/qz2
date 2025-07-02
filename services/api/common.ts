import { BackHandler } from "react-native";
import { getSessionId, isPhoneVerified, setSessionId } from "../storage";
import { alertAboutLogout } from "../common";
import * as RNLocalize from "react-native-localize";

export const getRequestHeaders = () => {
  return {
    "x-access-tokens": getSessionId().session_token,
    "Content-Type": "application/json",
    "Accept-Language": RNLocalize.getLocales()[0].languageCode,
  };
}

export type SuccessfulResponse<T> = {
  data: T;
  status: number;
}

export type ErrorResponse = {
  error: string;
  status: number;
}

export type DefaultResponse = {
  ok: boolean;
}

export const createError = async (response: Response): Promise<ErrorResponse> => {
  const error = await response.json();
  return { error: error.error, status: response.status };
}

export const createResponse = async <T>(response: Response): Promise<SuccessfulResponse<T>> => {
  const data = await response.json();
  return { status: response.status, data: data };
}

export const handleResponse = async <T = DefaultResponse>(response: Response): Promise<SuccessfulResponse<T>> => {
  if (response.status != 200) {
    throw await createError(response);
  }
  return await createResponse<T>(response);
}
