import { API } from "../../API";
import { setFeatureVerification } from "../storage";
import { getRequestHeaders, handleResponse, SuccessfulResponse } from "./common";


export const enum Feature {
  PHONE_VERIFICATION = "phone-verification",
}

type FeatureFlag = {
  enabled: boolean;
  data?: any;
}

export const canUseFeature = async (feature: Feature): Promise<SuccessfulResponse<FeatureFlag>> => {
  const response = await fetch(`${API}/feature/status?feature=${feature}`, {
    method: "GET",
    headers: getRequestHeaders(),
  });
  return await handleResponse(response);
}

export const updatePhoneVerificationState = async () => {
  try {
    const response = await canUseFeature(Feature.PHONE_VERIFICATION);
    setFeatureVerification(response.data.enabled);
  } catch (e) {
    setFeatureVerification(false);
  }
}
