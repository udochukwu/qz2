import { API } from "../../API";
import { VERSION } from "../../constants";
import { SuccessfulResponse, getRequestHeaders, handleResponse } from "./common";


type FollowupInput = {
  follow_up_question: string;
  request_id: string;
  is_pro: boolean;
  app_version: string;
}

export type Block = {
  block_data: {
    header_image: string;
    answer_text: string;
    answer_id: string;
    is_markdown: boolean;
    header_text: string;
  }
  block_type: 'need_pro' | any;
}

type FollowupResponse = {
  blocks: Block[];
  stream?: boolean;
  followup_id?: string;
  suggested_follow_ups?: string[];
}


export const postFollowupQuestionV2 = async (data: Omit<FollowupInput, 'app_version'>): Promise<SuccessfulResponse<FollowupResponse>> => {
  const body: FollowupInput = { ...data, app_version: VERSION };
  const response = await fetch(API + '/v2/problem/followup', {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify(body)
  });
  return handleResponse<FollowupResponse>(response);
}
