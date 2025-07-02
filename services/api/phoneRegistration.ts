import { API } from "../../API";
import { createError, createResponse, DefaultResponse, ErrorResponse, getRequestHeaders, handleResponse, SuccessfulResponse } from "./common";

type PhoneVerificationStatus = {
  phoneNumber: string;
  isVerified: boolean;
}

export type OTPVerificationResponse = {
  session_token: string;
  onboarding_steps: string;
  onboarded: boolean;
}

export const getPhoneVerificationStatus = async (): Promise<SuccessfulResponse<PhoneVerificationStatus> > => {
  const response = await fetch(API + "/phone/status", {
    method: "GET",
    headers: getRequestHeaders(),
  });
  return await handleResponse<PhoneVerificationStatus>(response);
}

export const postPhoneNumber = async (phone: string): Promise<SuccessfulResponse<DefaultResponse>> => {
  const response = await fetch(API + "/user/add/phone", {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify({ phone }),
  });
  return await handleResponse(response);
}

export const verifyOTP = async (otp: string): Promise<SuccessfulResponse<OTPVerificationResponse>> => {
  const response = await fetch(API + "/phone/verify/otp", {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify({ otp }),
  });
  return await handleResponse(response);
}

export const sendOTP = async (): Promise<SuccessfulResponse<DefaultResponse>> => {
  const response = await fetch(API + "/phone/send/otp", {
    method: "POST",
    headers: getRequestHeaders(),
  });
  return await handleResponse(response);
}
