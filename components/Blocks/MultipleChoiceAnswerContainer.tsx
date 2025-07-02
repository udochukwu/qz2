import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header1 from "./components/Header1";
import TextMarkDown from "./components/TextMarkDown";
import { FeedbackProps } from "./components/FeedbackButtons";
import QuestionOptionBox from "./components/QuestionOptionBox";
import Label from "../Label";
import { useTranslation } from "react-i18next";
import { blockstyles } from "./styles";
import { useSocketContext } from "../../services/socket";
import { FinalOption, offFinalOption, onFinalOption } from "../../services/socket/final_response";
import { offAnswerStreamResponse, onAnswerStreamResponse } from "../../services/socket/answer";
import ShareFeedback from "./components/ShareFeedback";
import ReportIssue from "../ReportIssue";
import Svg, { Circle } from "react-native-svg";

interface MultipleChoiceAnswerContainerProps {
    answer_text: string;
    feedback_props: FeedbackProps;
    selected_option_index: number[];
    selected_option_text: string[];
    header_text: string;
    header_image?: string;
    answer_url?: string;
    is_verified?: boolean;
    onReportProblem: () => void;
}


function MultipleChoiceAnswerContainer({ answer_text, feedback_props, selected_option_index, selected_option_text, header_text, header_image, answer_url, is_verified, onReportProblem }
    : MultipleChoiceAnswerContainerProps) {

    const { t } = useTranslation();
    const { socket } = useSocketContext();
    const [answer, setAnswer] = useState(answer_text);
    const [finalAnswer, setFinalAnswer] = useState<FinalOption>({ selected_option_text, selected_option_index });
    const [streaming, setStreaming] = useState(false);
    const [visible, setVisible] = useState(false);
    const setFinalOpton = (finalOption: FinalOption) => setFinalAnswer(finalOption);
    const setAnswerResponse = (token: string) => {
        setStreaming(true);
        setAnswer(prevAnswer => prevAnswer + token);
    }

    useEffect(() => {
        onFinalOption(socket, setFinalOpton);
        onAnswerStreamResponse(socket, setAnswerResponse);

        return () => {
            offFinalOption(socket, setFinalOpton);
            offAnswerStreamResponse(socket, setAnswerResponse);
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ ...blockstyles.card, paddingBottom: 16, position: 'relative' }}>
                <View style={{ flexDirection: 'row', alignContent: "center", marginBottom: 15, justifyContent: "space-between" }}>
                    <Header1 header_text={header_text} font_size={13} header_image={header_image} color={"#000"} font_weight="500" />
                    {is_verified && <Label text={t('Confident')} color={"#379259"} />}
                </View>
                
                <ReportIssue 
                    onReport={onReportProblem} 
                    isVisible={visible} 
                    setVisible={(e) => setVisible(e)} 
                    fromElement={(
                        <TouchableOpacity 
                            style={[{position: 'absolute', right: '2%', padding: 15, zIndex: 1 }, !(feedback_props || answer_url) && {top: 10}, (feedback_props || answer_url) && {bottom: 10} ]}
                            onPress={() => setVisible(true)}
                            accessibilityLabel="More options"
                        >
                            <Svg width="20" height="6" viewBox="0 0 20 6" fill="none">
                                <Circle cx="17.5" cy="3" r="2.5" fill="#6D6D6D"/>
                                <Circle cx="10.5" cy="3" r="2.5" fill="#6D6D6D"/>
                                <Circle cx="2.5" cy="3" r="2.5" fill="#6D6D6D"/>
                            </Svg>
                        </TouchableOpacity>
                    )} 
                />
                <Text style={styles.explanationText}>{t('Explanation')}</Text>
                <TextMarkDown text={answer} is_markdown={true} loaderDisabled={streaming} />

                {
                    finalAnswer.selected_option_index?.map((option_index, index) => {
                        return (
                            <View style={{ paddingTop: 10 }} key={index}>
                                <QuestionOptionBox option_text={finalAnswer.selected_option_text[index]} id={option_index} is_markdown={true} key={index} selected={true} last_item={true} />
                            </View>
                        )
                    })
                }
                {(feedback_props || answer_url) && <ShareFeedback feedback_props={feedback_props} answer_url={answer_url} />}
            </View>
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
    },
    explanationText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        fontFamily: 'Inter',
        color: "#000",
        marginTop: 7,
        marginBottom: 8,
    }
})


export default MultipleChoiceAnswerContainer;
export type { MultipleChoiceAnswerContainerProps };
