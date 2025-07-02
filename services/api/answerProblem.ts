import { API } from "../../API";
import { VERSION } from "../../constants";
import { SuccessfulResponse, getRequestHeaders, handleResponse } from "./common";

type Problem = {
  app_version: string;
  problem_data: string[];
  is_pro: boolean;
  base64_image?: string;
  force_api?: boolean;
}

export type Answer = {
  status: string;
  stream?: boolean;
  request_id: string;
  blocks: any;
  templates: any;
  max_chars_per_follow_up: number;
  tokens_left: number;
  diagram_found?: boolean;
  cropped_diagram_image_urls?: string[];
  suggested_follow_ups?: string[];
}

export const answerProblemV5 = async (data: Omit<Problem, 'app_version'>): Promise<SuccessfulResponse<Answer>> => {
  const body: Problem = { ...data, app_version: VERSION };
  const response = await fetch(API + '/v5/problem/answer', {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify(body)
  });
  return handleResponse<Answer>(response);
}

type ContinueProblem = {
  request_id: string;
  use_diagram: boolean;
  force_api?: boolean;
}
export const continueAnswerProblemV5 = async (data: ContinueProblem): Promise<SuccessfulResponse<Answer>> => {
  const body: ContinueProblem = { ...data };
  const response = await fetch(API + '/v5/problem/answer/continue', {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify(body)
  });
  return handleResponse<Answer>(response);
}
