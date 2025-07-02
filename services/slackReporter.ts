import { API } from "../API";
import { SLACK_WEBHOOK } from "../config";
import { getRequestHeaders, handleResponse, SuccessfulResponse } from "./api/common";

export const sendReport = async (request_id: string, user_id: string, user_message: string, image_url: string): Promise<Response | void> => {
  return await fetch(SLACK_WEBHOOK, {
    method: "POST",
    body: JSON.stringify({
      text: user_message, attachments: [
        {
          title:`Report from User: ${user_id}, Request ID: ${request_id}`,
          image_url
        }
      ]
    }),
    headers: getRequestHeaders(),
  });
}

export const uploadScreenshot = async (fileName: string): Promise<SuccessfulResponse<{final_image_url: string, presigned_url: any[]}>> => {
  const response = await fetch(API + `/v1/feedback/image-upload?file_name=${fileName}`, {
    method: "GET",
    headers: getRequestHeaders()
  });

  return await handleResponse(response);
}

export const uploadImageToPreSignedUrl = async (uploadUrl: string, imageUri: string): Promise<Response | void> => {
  const imageData = await fetch(imageUri).then(res => res.blob());

  return await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/png',
    },
    body: imageData
  });

};
