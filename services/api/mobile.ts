import { getUniqueId } from "react-native-device-info";
import { API } from "../../API"
import { VERSION } from "../../constants";
import { SuccessfulResponse, getRequestHeaders, handleResponse } from "./common"

export type ActiveVersion = {
  version: string;
}

export const getActiveMobileVersion = async (): Promise<SuccessfulResponse<ActiveVersion>> => {
  const url = new URL(API + '/mobile/active/version')
  url.searchParams.append('current', VERSION);
  url.searchParams.append('device-id', await getUniqueId());
  const response = await fetch(url.toString(), { method: 'GET' });
  const handledRedponse = await handleResponse<ActiveVersion>(response);
  return handledRedponse;
}
