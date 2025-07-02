import { MMKV } from "react-native-mmkv";
import { VERSION } from "../constants";
import { compareVersions } from "./common";
import * as Sentry from "@sentry/react-native";
export const storage = new MMKV();

const enum StorageKeys {
  SESSION_ID_KEY = "session_id",
  USER_ID_KEY = "user_id",
  ONBOARDED_KEY = "onboarded",
  PHONE_VERIFICATION_KEY = "phone-verified",
  OTP_ATTEMPTS_KEY = "otp-validation",
  FEATURE_PHONE_VERIFICATION = "feature-phone-verification",
  //The person who referred the user to the app
  REFERRAL_CODE = "referral_code",
  ACTIVE_VERSION_KEY = "active-version",
  SURVEY_DISPLAY_TIMEOUT = "survey-display-timeout",
  TOKENS_NUMBER = "tokens-number",
  FEEDBACK = "gave_feedback",
  OPEN_COUNT = "app_opened_count",
  PRO_REFERRAL_CODE = "pro_referral_code",
  SALE_KEY = "sale_key",
  PAYWALL_OPEN_COUNT = "paywall_open_count",
  SHOWED_BACK_TO_SCHOOL_DISCOUNT = "showed_back_to_school_discount",
  IS_PRO_LOCALLY = "is_pro_locally",
}

type SaleConfig = {
  timestamp: number;
  duration: number;
  show_sale: boolean;
}


export const setTokensNumber = (tokens: number) => {
  if (typeof tokens !== "number") {
    Sentry.captureException(new Error("Tokens number is not a number , got " + typeof tokens));
    return;
  }
  storage.set(StorageKeys.TOKENS_NUMBER, tokens);
}
export const getTokensNumber = (): number => {
  const tokens = storage.getNumber(StorageKeys.TOKENS_NUMBER);

  if (tokens === undefined) {
    return 0;
  }
  else
    return tokens;
}
export const DEFAULT_TIMEOUT = 1000 * 60 * 60 * 24;

export const hasSessionId = (): boolean => {
  const sessionId = storage.getString(StorageKeys.SESSION_ID_KEY);
  return sessionId !== undefined;
}

export const getSessionId = () => {
  const session_str = storage.getString(StorageKeys.SESSION_ID_KEY);
  if (session_str === undefined) {
    throw new Error("session_id is not set! Please use hasSessionId() before calling this method");
  }
  return JSON.parse(session_str);
}

export const setSessionId = (session: object) => {
  storage.set(StorageKeys.SESSION_ID_KEY, JSON.stringify(session));
}


export const setUserId = (userId: string) => {
  storage.set(StorageKeys.USER_ID_KEY, userId);
}

export const getUserId = (): string | undefined => {
  return storage.getString(StorageKeys.USER_ID_KEY);
}

export const isOnboarded = (): boolean => {
  const isOnboarded = storage.getBoolean(StorageKeys.ONBOARDED_KEY);
  return isOnboarded === true;
}

export const setOnboarded = (onboarded: boolean) => {
  storage.set(StorageKeys.ONBOARDED_KEY, onboarded);
}

export const isPhoneVerified = (): boolean => {
  const isPhoneVerified = storage.getBoolean(StorageKeys.PHONE_VERIFICATION_KEY);
  return isPhoneVerified === true;
}

export const setPhoneVerified = (verified: boolean) => {
  storage.set(StorageKeys.PHONE_VERIFICATION_KEY, verified);
}

type OTPAttempts = {
  attempts: number;
  date: number;
}

const defaultAttempts: OTPAttempts = { attempts: 0, date: 0 };

export const registerOTPAttempt = () => {
  const otpAttempts_str = storage.getString(StorageKeys.OTP_ATTEMPTS_KEY);
  if (otpAttempts_str === undefined) {
    const otpAttempts: OTPAttempts = { attempts: 1, date: Date.now() };
    storage.set(StorageKeys.OTP_ATTEMPTS_KEY, JSON.stringify(otpAttempts));
    return;
  }
  const otpAttempts: OTPAttempts = JSON.parse(otpAttempts_str);
  otpAttempts.attempts += 1;
  otpAttempts.date = Date.now();
  storage.set(StorageKeys.OTP_ATTEMPTS_KEY, JSON.stringify(otpAttempts));
}

export const getOTPAttempts = (): OTPAttempts => {
  const otpAttempts_str = storage.getString(StorageKeys.OTP_ATTEMPTS_KEY);
  if (otpAttempts_str === undefined) {
    return defaultAttempts;
  }
  return JSON.parse(otpAttempts_str);
}

export const resetOTPAttempts = () => {
  storage.set(StorageKeys.OTP_ATTEMPTS_KEY, JSON.stringify(defaultAttempts));
}

export const setFeatureVerification = (enabled: boolean) => {
  storage.set(StorageKeys.FEATURE_PHONE_VERIFICATION, enabled);
}

export const isPhoneVerificationEnabled = (): boolean => {
  return !!storage.getBoolean(StorageKeys.FEATURE_PHONE_VERIFICATION)
}

export const logout = () => {
  storage.clearAll();
}

export const shouldCallActiveVersion = (): boolean => {
  const lastCall_str = storage.getString(StorageKeys.ACTIVE_VERSION_KEY)
  if (lastCall_str === undefined) {
    return true;
  }
  const lastCall = JSON.parse(lastCall_str);
  return lastCall.timestamp + DEFAULT_TIMEOUT < Date.now();
}

export const shouldAlertActiveVersion = (): boolean => {
  const lastCall_str = storage.getString(StorageKeys.ACTIVE_VERSION_KEY)
  if (lastCall_str === undefined) {
    return true;
  }
  const lastCall = JSON.parse(lastCall_str);
  if (compareVersions(VERSION, lastCall.version) === 1) {
    return false;
  }
  return lastCall.version !== VERSION;
}

export const setActiveVersionCall = (version: string) => {
  storage.set(StorageKeys.ACTIVE_VERSION_KEY, JSON.stringify({ timestamp: Date.now(), version }));
}

export const setSurveyDisplayTimeout = () => {
  storage.set(StorageKeys.SURVEY_DISPLAY_TIMEOUT, Date.now());
}

export const canDisplaySurvey = () => {
  const timeout = storage.getNumber(StorageKeys.SURVEY_DISPLAY_TIMEOUT);
  if (timeout === undefined) {
    return true;
  }
  return timeout + DEFAULT_TIMEOUT < Date.now();
}

export const appOpensCount = (): number => {
  return storage.getNumber(StorageKeys.OPEN_COUNT) || 1;
}
export const incrementAppOpensCount = () => {
  const count = appOpensCount();
  storage.set(StorageKeys.OPEN_COUNT, count + 1);
}

export const hasFeedback = (): boolean => {
  return storage.getBoolean(StorageKeys.FEEDBACK) || false;
}

export const giveFeedback = () => {
  return storage.set(StorageKeys.FEEDBACK, true);
}

export const setProReferral = (code: string) => {
  return storage.set(StorageKeys.PRO_REFERRAL_CODE, code);
}

export const getProReferral = (): string | undefined => {
  return storage.getString(StorageKeys.PRO_REFERRAL_CODE);
}

export const setSalesTimestamp = () => {
  const max = 15, min = 3;
  const duration = Math.floor(Math.random() * (max - min + 1)) + min;
  storage.set(StorageKeys.SALE_KEY, JSON.stringify({ timestamp: Date.now(), duration, show_sale: true }));
}

export const setShowSale = (show: boolean) => {
  const saleConfig = getSaleConfig();
  if (saleConfig === null) {
    return;
  }
  saleConfig.show_sale = show;
  storage.set(StorageKeys.SALE_KEY, JSON.stringify(saleConfig));
}

export const getSaleConfig = (): SaleConfig | null => {
  const sale_str = storage.getString(StorageKeys.SALE_KEY);
  if (sale_str === undefined) {
    return null;
  }
  return JSON.parse(sale_str);
}

export const incrementPaywallOpenCount = () => {
  const count = storage.getNumber(StorageKeys.PAYWALL_OPEN_COUNT) || 0;
  storage.set(StorageKeys.PAYWALL_OPEN_COUNT, count + 1);
}

export const getPaywallOpenCount = () => {
  return storage.getNumber(StorageKeys.PAYWALL_OPEN_COUNT) || 0;
}

export const setShowedBackToSchoolDiscount = (b: boolean) => {
  storage.set(StorageKeys.SHOWED_BACK_TO_SCHOOL_DISCOUNT, b);
}

export const hasShowedBackToSchoolDiscount = () => {
  return storage.getBoolean(StorageKeys.SHOWED_BACK_TO_SCHOOL_DISCOUNT) || false;
}

export const setIsProLocally = (isPro: boolean) => {
  storage.set(StorageKeys.IS_PRO_LOCALLY, isPro);
}

export const isProLocally = () => {
  return storage.getBoolean(StorageKeys.IS_PRO_LOCALLY) || false;
}