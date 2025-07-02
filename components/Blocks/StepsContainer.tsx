import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { blockstyles } from "./styles";
import React, { useEffect, useState } from "react";
import Header1 from "./components/Header1";
import TextMarkDown from "./components/TextMarkDown";
import QuestionOptionBox from "./components/QuestionOptionBox";
import { useSocketContext } from "../../services/socket";
import { offNewStepResponse, offStepResponse, onNewStepResponse, onStepResponse } from "../../services/socket/steps";
import { FinalAnswer, FinalOption, isFinalAnswer, offFinalAnswer, offFinalOption, onFinalAnswer, onFinalOption } from "../../services/socket/final_response";
import { useTranslation } from "react-i18next";
import ShareFeedback from "./components/ShareFeedback";
import ReportIssue from "../ReportIssue";
import Svg, { Circle } from "react-native-svg";


type StepsContainerProps = {
    steps: string[]
    header_text: string;
    header_image?: string;
    final_answer?: FinalAnswer | FinalOption;
    feedback_props?: any;
    answer_url?: string;
    onReportProblem: () => void;
}

function StepsContainer({ header_text, header_image, feedback_props, answer_url, onReportProblem, ...props }: StepsContainerProps) {
    const { socket } = useSocketContext();
    const [steps, setSetps] = useState(props.steps);
    const [finalAnswer, setFinalAnswer] = useState(props.final_answer);
    const [streaming, setStreaming] = useState(false);
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const addNewStep = () => {
        setStreaming(true);
        setSetps(prevSteps => {
            prevSteps.push("");
            return prevSteps;
        });
    };

    const appendTokenToLastStep = (token: string) => {
        setStreaming(true);
        setSetps(prevSteps => {
            prevSteps[prevSteps.length - 1] += token;
            return [...prevSteps];
        });
    }

    const setFinalOption = (finalOption: FinalAnswer | FinalOption) => setFinalAnswer(finalOption);

    useEffect(() => {
        onNewStepResponse(socket, addNewStep);
        onStepResponse(socket, appendTokenToLastStep);
        onFinalOption(socket, setFinalOption);
        onFinalAnswer(socket, setFinalOption);

        return () => {
            offNewStepResponse(socket, addNewStep);
            offStepResponse(socket, appendTokenToLastStep);
            offFinalOption(socket, setFinalOption);
            offFinalAnswer(socket, setFinalOption);
        }
    }, []);


    return (
        <View style={blockstyles.container}>
            <View style={{ ...blockstyles.card, paddingBottom: 16, position: 'relative' }}>
                <Header1
                    header_text={header_text}
                    font_size={13}
                    header_image={header_image}
                    color={"#000"}
                    font_weight="500"
                />
                
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
                                <Circle cx="16.67" cy="3" r="2.5" fill="#6D6D6D"/>
                                <Circle cx="10" cy="3" r="2.5" fill="#6D6D6D"/>
                                <Circle cx="3.33" cy="3" r="2.5" fill="#6D6D6D"/>
                            </Svg>
                        </TouchableOpacity>
                    )} 
                />
                {steps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                        <Text style={styles.title}>{t("steps.step", { step: index + 1 })}</Text>
                        <TextMarkDown text={step} is_markdown={true} loaderDisabled={streaming} />
                    </View>
                ))}
                {finalAnswer && !isFinalAnswer(finalAnswer) && finalAnswer.selected_option_text?.length > 0 && (
                    <View style={styles.finalAnswerContainer}>
                        <Text style={styles.title}>{t("steps.finalAnswer")}</Text>
                        {finalAnswer.selected_option_text.map((option_text, index) => (
                            <QuestionOptionBox
                                key={index}
                                option_text={option_text}
                                id={finalAnswer.selected_option_index[index]}
                                is_markdown={true}
                                selected={true}
                            />
                        ))}
                    </View>
                )}

                {finalAnswer && isFinalAnswer(finalAnswer) && finalAnswer.answer_text?.length > 0 && (
                    <View style={styles.finalAnswerContainer}>
                        <Text style={styles.title}>{t("steps.finalAnswer")}</Text>
                        <QuestionOptionBox
                            option_text={finalAnswer.answer_text}
                            id={-1}
                            is_markdown={true}
                            selected={true}
                        />
                    </View>

                )}
                {(feedback_props || answer_url) && <ShareFeedback feedback_props={feedback_props} answer_url={answer_url} />}

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    stepContainer: {
        marginTop: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    stepContent: {
        fontSize: 16,
    },
    finalAnswerContainer: {
        marginTop: 16,
    }
});


export default StepsContainer;
