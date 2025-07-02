
step_block = [{
    "block_data": {
        "header_image": "https://quizard-app-public-assets.s3.us-east-2.amazonaws.com/you.png",
        "header_text": "You",
        "is_markdown": true,
        "question_text": "One of the two equations in a linear system is $2 x+2 y=2$. The system has no solution. Which equation could be the other equation in the system?\nA) $3 x-3 y=3$.\nB) $3 x+3 y=3$\nC) $2 x-2 y=2$\nD) $2 x+2 y=3$",
        "question_type_text": "Short Answer - None",
        "view_count": 1
    },
    "block_type": "short_question"
},
{
    "block_type": "steps",
    "block_data": {
        "header_text": "Step by Step Solution",
        "header_image": "https://quizard-app-public-assets.s3.us-east-2.amazonaws.com/answer.png",
        "steps": [
            {
                "content": "For a system of linear equations to have no solution, the lines represented by the two equations must be parallel, which means they must have the same slope but different y-intercepts.",

            },
            {
                "content": "First, simplify the given equation $2x + 2y = 2$ by dividing everything by 2.\n$x + y = 1$",
            },
            {
                "content": "Determine the slope of the given equation. \nSlope m = -1",
            },
            {
                "content": "Determine the slope of the equations provided in the options.\nA) Slope m = 1, B) Slope m = -1, C) Slope m = 1, D) Slope m = -1",
            },
            {
                "content": "Compare the slopes to determine which equation gives a line parallel to the given equation.\nOption D) $2x + 2y = 3$ has the same slope but different y-intercept.",
            }
        ],
        "final_answer": "D) $2x + 2y = 3$"
    }

}]


export const fake_data = {
    max_chars_per_follow_up: 150,
    request_id: "e4fc1737-7657-4f58-9f69-90718a8d9044",
    status: 2,
    tokens_left: 24,
    blocks: step_block
}