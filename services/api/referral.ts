import {API} from '../../API';
import {getRequestHeaders, handleResponse, SuccessfulResponse} from './common';

export interface ReferralCheckRequest {
  referral_code: string;
}

export interface ReferralCheckResponse {
  ok: boolean;
  referrer: string;
}

export interface ReferralConfirmResponse {
  ok: boolean;
}

export interface ReferralStatusResponse {
  ok: boolean;
  total_referrals: number;
  pro_referrals: number;
  required_pro: number;
  free_months: number;
}

export interface ReferralRedeemResponse {
  ok: boolean;
  status?: string;
  code?: string;
}

export const checkReferralCode = async (code: string): Promise<SuccessfulResponse<ReferralCheckResponse>> => {
  const response = await fetch(API + '/v1/user/referral/check', {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify({referral_code: code} as ReferralCheckRequest),
  });
  return await handleResponse<ReferralCheckResponse>(response);
};

export const confirmReferral = async (code: string): Promise<SuccessfulResponse<ReferralConfirmResponse>> => {
  const response = await fetch(API + '/v1/user/referral/confirm', {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify({referral_code: code} as ReferralCheckRequest),
  });
  return await handleResponse<ReferralConfirmResponse>(response);
};

export const getReferralStatus = async (): Promise<SuccessfulResponse<ReferralStatusResponse>> => {
  const response = await fetch(API + '/v1/user/referral/status', {
    method: 'GET',
    headers: getRequestHeaders(),
  });
  return await handleResponse<ReferralStatusResponse>(response);
};

export const redeemReferralOffer = async (): Promise<SuccessfulResponse<ReferralRedeemResponse>> => {
  const response = await fetch(API + '/v1/user/referral/redeem', {
    method: 'POST',
    headers: getRequestHeaders(),
  });
  return await handleResponse<ReferralRedeemResponse>(response);
};
