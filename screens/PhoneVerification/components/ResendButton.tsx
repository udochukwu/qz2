import React, { useEffect, useState } from "react";
import { TextButton } from "../../../components/Button";
import { ErrorResponse } from "../../../services/api/common";
import { sendOTP } from "../../../services/api/phoneRegistration";
import { getOTPAttempts, registerOTPAttempt, resetOTPAttempts, storage } from "../../../services/storage";
import { useTranslation } from "react-i18next";

// 0, 0, 10s, 20s, 30s, 1m, 1m10s
const timeouts = [0, 0, 10, 20, 30, 60, 70];
// 1h
const resetAfter = 60 * 60;

export const ResendButton = () => {
  const [retryTimeout, setRetryTimeout] = useState(0);
  const { t } = useTranslation()
  useEffect(() => {
    handleOTPSending();
  }, []);

  useEffect(() => {
    if (retryTimeout === 0) {
      return;
    }
    setTimeout(() => setRetryTimeout(retryTimeout - 1), 1000);
  }, [retryTimeout])

  const handleOTPSending = async () => {
    const otpAttempts = getOTPAttempts();
    const elapsedSeconds = Math.ceil(((new Date().getTime()) - (new Date(otpAttempts.date).getTime())) / 1000);

    if (otpAttempts.date > 0 && elapsedSeconds >= resetAfter) {
      resetOTPAttempts();
    } else {
      const timeout = timeouts[otpAttempts.attempts >= timeouts.length ? timeouts.length - 1 : otpAttempts.attempts];
      const currTimeout = timeout - elapsedSeconds;

      if (currTimeout > 0) {
        setRetryTimeout(currTimeout);
        return;
      }
    }

    await sendOTP()
      .then(() => registerOTPAttempt())
      .catch((error: ErrorResponse) => {
        if (error.status === 429) {
          setRetryTimeout(70);
        }
      });
  }

  const getResendText = () => {
    if (retryTimeout === 0) {
      return t('otpScreen.resend')
    }
    if (retryTimeout > 60) {
      return `${t('otpScreen.resend')} (${Math.round(retryTimeout / 60)}m)`
    }
    return `${t('otpScreen.resend')} (${retryTimeout}s)`
  }

  return (
    <TextButton
      disabled={retryTimeout > 0}
      text={getResendText()}
      onPress={handleOTPSending}
    />
  );
}
