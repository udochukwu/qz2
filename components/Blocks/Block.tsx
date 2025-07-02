import React from 'react';
import { StyleSheet, View } from 'react-native';
import ShortQuestionContainer from './ShortQuestionContainer';
import MultipleChoiceQuestionContainer from './MultipleChoiceQuestionContainer';
import AnswerContainer from './AnswerContainer';
import MultipleChoiceAnswerContainer from './MultipleChoiceAnswerContainer';
import NeedProContainer from './NeedProContainer';
import ResourceGroupContainer from './ResourceGroupContainer';
import LockedResourceGroupContainer from './LockedResourceGroupContainer';
import StepsContainer from './StepsContainer';
import SuggestedFollowUpContainer from './SuggestedFollowUpContainer';
import LockedSuperAIContainer from './LockedSuperAIContainer';

const BLOCK_COMPONENTS: any = {
    "short_question": ShortQuestionContainer,
    "multiple_choice": MultipleChoiceQuestionContainer,
    "short_answer": AnswerContainer,
    "multiple_choice_answer": MultipleChoiceAnswerContainer,
    "resource_group": ResourceGroupContainer,
    "need_pro": NeedProContainer,
    "locked_super_ai": LockedSuperAIContainer,
    "locked_resource_group": LockedResourceGroupContainer,
    "steps": StepsContainer,
    "follow_up": SuggestedFollowUpContainer,
};
const functionalProps: any = {
    "short_question": ["on_resources"],
    "multiple_choice": ["on_resources"],
}

type BlockProps = {
    request_id: string,
    block_type: string,
    block_data: any,
    openReportModal: () => void
}

function Block({ request_id, block_type, block_data, openReportModal }: BlockProps) {
    const Component = BLOCK_COMPONENTS[block_type];
    let props: any = {};

    if (functionalProps[block_type]) {
        props = functionalProps[block_type].reduce((acc: any, key: string) => {
            acc[key] = () => {
                console.log("Called", key);
            }
            return acc;
        }, {});
    }

    if (!Component) {
        return null;
    }

    return (
        <View style={styles.itemContainer}>
            <Component {...block_data} {...props} request_id={request_id} onReportProblem={openReportModal} />
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%',
        // marginTop: 10,

    }
});

export default React.memo(Block);
