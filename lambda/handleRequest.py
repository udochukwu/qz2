
import json
from botocore.vendored import requests


def lambda_handler(event, context):

    # get the question from the body
    question = event['body']
    print(question)
    if question is None:
        return {
            'statusCode': 400,
            'body': json.dumps("No question provided")
        }
    answer = getGPT3(question)
    print(answer)
    return {
        'statusCode': 200,
        'body': json.dumps(answer)
    }


def getGPT3(text):
    # Path: backend/handleRequest.py
    API_KEY = "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"
    #         //stringify text
    text = json.dumps(text)
    textHeader = "AI Assistant to help read a question from a parsed image and answer the question correctly.\nfrom the parsed image we will get:\nWhat\'s the question?\nwhat are the possible answers provided?\nwhat are the correct answers?\n\nThe output should be in a format of:\nQuestion: question if found otherwise it will be N/A\nProvided possible answers: separate possible answers with a \"| \" ,  N/A if none is provided\nCorrect Answer(s): the correct answer or answers (if there\'re multiple correct answers), if there\'s no provided answer the assistant will come up with a correct answer to the question.\n\nif more than one question detected just answer the first one.\nParsed Input from image:\n"
    text = textHeader + text
    params = {
        "model": "text-davinci-003",
        "prompt": text,
        # "instructions": "Get the awnser to the question",
        "max_tokens": 250,
        "temperature": 0.7,
    }
    response = requests.post('https://api.openai.com/v1/completions', headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
    }, data=json.dumps(params))
    return response.json()
