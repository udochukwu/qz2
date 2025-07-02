import { ShortQuestionContainerProps } from "../components/Blocks/ShortQuestionContainer"
import { Block } from "./api/followup"

const SUPPORTED_TEMPLATE_TYPES = ['short_question']


/**
 * Creates a short question block from a text string
 * @param templates
 * @param text
 */
export function createShortQuestionBlock({ templates, text }: { templates: [any], text: string }): ShortQuestionContainerProps {
    const template = findTemplate(templates, 'short_question')
    if (template) {

        return {
            header_image: template.block_data.header_image,
            header_text: template.block_data.header_text,
            is_markdown: template.block_data.is_markdown,
            question_text: text,
        }
    }
    else {
        return {
            header_image: "https://quizard-app-public-assets.s3.us-east-2.amazonaws.com/you.png",
            header_text: "You",
            is_markdown: false,
            question_text: text


        }
    }
}

/**
 * Returns true if they can't send a followup question
 * Check if there's "need_pro" block in the blocks array
 */

export function canSendFollowupQuestion(blocks: Block[]) {
    return !blocks.some(block => block.block_type === "need_pro")
}

function findTemplate(templates: [any], template_name: string) {
    return templates.find(template => template.block_type === template_name)
}

