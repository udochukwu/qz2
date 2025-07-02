import { API } from "../../API";
import { DefaultResponse, SuccessfulResponse, getRequestHeaders, handleResponse } from "./common";
import * as RNLocalize from "react-native-localize";

export type Survey = {
  id: string;
  question: string;
  type: 'OPEN_ENDED' | 'SINGLE_SELECT' | 'MULTI_SELECT' | 'NESTED';
  options?: string[];
  questions?: Survey[]
};

type SurveyWrapper = {
  survey: Survey;
}

export const getDynamicSurvey = async (): Promise<SuccessfulResponse<SurveyWrapper>> => {
  const response = await fetch(API + `/v1/dynamic/survey?country=${RNLocalize.getCountry()}`, {
    method: "GET",
    headers: getRequestHeaders(),
  });
  return await handleResponse<SurveyWrapper>(response);
}

export const skipDynamicSurvey = async (questionId: string): Promise<SuccessfulResponse<DefaultResponse>> => {
  const response = await fetch(API + "/v1/dynamic/survey/skip", {
    method: "PUT",
    headers: getRequestHeaders(),
    body: JSON.stringify({ question_id: questionId })
  });
  return await handleResponse(response);
}

export const answerDynamicSurvey = async (questionId: string, answers: string[]): Promise<SuccessfulResponse<DefaultResponse>> => {
  const response = await fetch(API + "/v1/dynamic/survey/answer", {
    method: "PUT",
    headers: getRequestHeaders(),
    body: JSON.stringify({ question_id: questionId, answers })
  });
  return await handleResponse(response);
}
